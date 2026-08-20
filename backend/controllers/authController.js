const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
    expiresIn: '30d'
  });
};

// @desc    Register new user & immediately sign in
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: true
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        isMfaEnabled: user.isMfaEnabled,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token (or trigger 2FA check)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password, totpCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password +mfaSecret');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if 2FA / MFA is enabled for this account
    if (user.isMfaEnabled) {
      if (!totpCode) {
        return res.status(200).json({
          success: true,
          require2FA: true,
          message: '2-Step Verification required. Please supply your 6-digit authenticator code.'
        });
      }

      // Verify the 6-digit TOTP code
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: totpCode,
        window: 1
      });

      if (!verified) {
        return res.status(400).json({
          success: false,
          require2FA: true,
          message: 'Invalid 2-Step Verification code'
        });
      }
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        isMfaEnabled: user.isMfaEnabled,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate 2FA Secret & QR Code for setup
// @route   POST /api/auth/2fa/setup
// @access  Private
const setup2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const secret = speakeasy.generateSecret({
      name: `TodoApp (${user.email})`,
      issuer: 'TodoApp Security'
    });

    user.mfaSecret = secret.base32;
    await user.save();

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCodeUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify initial 2FA setup with token
// @route   POST /api/auth/2fa/verify
// @access  Private
const verify2FASetup = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id).select('+mfaSecret');

    if (!user.mfaSecret) {
      return res.status(400).json({ success: false, message: '2FA setup not initiated' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 1
    });

    if (verified) {
      user.isMfaEnabled = true;
      user.isMfaVerified = true;
      await user.save();

      res.json({
        success: true,
        message: '2-Step Verification enabled successfully!'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your authenticator app.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Disable 2FA for account
// @route   POST /api/auth/2fa/disable
// @access  Private
const disable2FA = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ success: false, message: 'Incorrect password' });
    }

    user.isMfaEnabled = false;
    user.mfaSecret = undefined;
    await user.save();

    res.json({
      success: true,
      message: '2-Step Verification disabled'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile avatar
// @route   PUT /api/auth/avatar
// @access  Private
const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.avatar = avatar;
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isMfaEnabled: user.isMfaEnabled
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        isMfaEnabled: user.isMfaEnabled
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  setup2FA,
  verify2FASetup,
  disable2FA,
  updateAvatar,
  getMe
};

