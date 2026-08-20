import React, { useState } from 'react';
import { authApi } from '../services/api';
import { ShieldCheck, ShieldAlert, QrCode, Key, CheckCircle, AlertTriangle } from 'lucide-react';

const TwoFactorModal = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [step, setStep] = useState('init'); // 'init' | 'setup' | 'disable'
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartSetup = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await authApi.setup2FA();
      if (res.success) {
        setQrCodeUrl(res.data.qrCodeUrl);
        setSecret(res.data.secret);
        setStep('setup');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verify2FA(verifyToken);
      if (res.success) {
        setSuccessMsg('2-Step Verification enabled successfully!');
        onUpdateUser({ ...user, isMfaEnabled: true });
        setTimeout(() => {
          onClose();
          setStep('init');
          setSuccessMsg('');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.disable2FA(disablePassword);
      if (res.success) {
        setSuccessMsg('2-Step Verification has been disabled.');
        onUpdateUser({ ...user, isMfaEnabled: false });
        setTimeout(() => {
          onClose();
          setStep('init');
          setSuccessMsg('');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck style={{ color: 'var(--primary-color)' }} />
            2-Step Verification Security
          </h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && (
          <div className="atlas-banner error-banner" style={{ margin: '1rem 0' }}>
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="atlas-banner success-banner" style={{ margin: '1rem 0', background: 'rgba(16, 185, 129, 0.15)', borderColor: 'var(--success-color)', color: '#10b981' }}>
            <CheckCircle size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'init' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            {user?.isMfaEnabled ? (
              <>
                <div style={{ color: '#10b981', marginBottom: '1rem' }}>
                  <ShieldCheck size={56} style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>2FA is Currently Active</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Your account is protected with 6-digit authenticator verification code requirements on login.
                </p>
                <button
                  className="btn btn-secondary"
                  style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                  onClick={() => setStep('disable')}
                >
                  Disable 2-Step Verification
                </button>
              </>
            ) : (
              <>
                <div style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                  <ShieldAlert size={56} style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>Protect Your Account</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Add an extra layer of security. Use an Authenticator app (Google Authenticator, Authy) to scan a QR code.
                </p>
                <button className="btn btn-primary" onClick={handleStartSetup} disabled={loading}>
                  {loading ? 'Generating QR Code...' : 'Set Up 2-Step Verification'}
                </button>
              </>
            )}
          </div>
        )}

        {step === 'setup' && (
          <form onSubmit={handleVerifySetup} style={{ padding: '0.5rem 0' }}>
            <ol style={{ paddingLeft: '1.2rem', margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              <li>Scan the QR code below using your mobile Authenticator App:</li>
            </ol>

            {qrCodeUrl && (
              <div style={{ textAlign: 'center', margin: '1rem 0', background: '#ffffff', padding: '1rem', borderRadius: '12px', display: 'inline-block', left: '50%', transform: 'translateX(-50%)', relative: 'true' }}>
                <img src={qrCodeUrl} alt="2FA QR Code" style={{ width: '180px', height: '180px' }} />
              </div>
            )}

            <div style={{ background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem', textAlign: 'center' }}>
              <span>Secret Key: </span>
              <strong style={{ fontFamily: 'monospace', color: 'var(--primary-color)', letterSpacing: '1px' }}>{secret}</strong>
            </div>

            <div className="form-group">
              <label>Enter 6-Digit Code from App to Confirm:</label>
              <input
                type="text"
                maxLength="6"
                placeholder="123456"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value.replace(/\D/g, ''))}
                required
                style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.3rem', fontWeight: 'bold' }}
              />
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep('init')}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </button>
            </div>
          </form>
        )}

        {step === 'disable' && (
          <form onSubmit={handleDisable2FA} style={{ padding: '0.5rem 0' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Please confirm your current password to turn off 2-Step Verification.
            </p>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                required
              />
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep('init')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ background: '#ef4444' }} disabled={loading}>
                {loading ? 'Disabling...' : 'Confirm Disable'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TwoFactorModal;
