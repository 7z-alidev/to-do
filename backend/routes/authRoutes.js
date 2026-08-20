const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  setup2FA,
  verify2FASetup,
  disable2FA,
  updateAvatar,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, getMe);
router.put('/avatar', protect, updateAvatar);
router.post('/2fa/setup', protect, setup2FA);
router.post('/2fa/verify', protect, verify2FASetup);
router.post('/2fa/disable', protect, disable2FA);


module.exports = router;
