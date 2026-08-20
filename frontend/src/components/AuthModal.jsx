import React, { useState } from 'react';
import { authApi } from '../services/api';
import { ShieldCheck, ShieldAlert, KeyRound, Lock, User, Mail, LogIn, UserPlus } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [totpCode, setTotpCode] = useState('');
  const [require2FA, setRequire2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', password: '' });
    setTotpCode('');
    setRequire2FA(false);
    setError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    handleReset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await authApi.register(formData);
        if (res.success) {
          onAuthSuccess(res.data);
          onClose();
        }
      } else {
        // Login flow
        const payload = {
          email: formData.email,
          password: formData.password
        };
        if (require2FA) {
          payload.totpCode = totpCode;
        }

        const res = await authApi.login(payload);
        if (res.require2FA) {
          setRequire2FA(true);
          setError(res.message || 'Please enter 2-Step Verification code');
        } else if (res.success) {
          onAuthSuccess(res.data);
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2>
            {require2FA
              ? '2-Step Verification'
              : mode === 'login'
              ? 'Welcome Back'
              : 'Create Account'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && (
          <div className="atlas-banner error-banner" style={{ margin: '1rem 0' }}>
            <ShieldAlert size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {require2FA ? (
            <div className="form-group" style={{ textAlign: 'center' }}>
              <div style={{ margin: '1rem 0', color: 'var(--primary-color)' }}>
                <KeyRound size={48} style={{ margin: '0 auto' }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Open your authenticator app (Google Authenticator, Authy, etc.) and enter your 6-digit security code.
              </p>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                style={{
                  fontSize: '1.8rem',
                  letterSpacing: '0.5rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: '0.6rem'
                }}
              />
            </div>
          ) : (
            <>
              {mode === 'register' && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <User size={18} />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          )}

          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (require2FA) {
                  setRequire2FA(false);
                  setError('');
                } else {
                  onClose();
                }
              }}
            >
              {require2FA ? 'Back' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? 'Processing...'
                : require2FA
                ? 'Verify & Sign In'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </div>
        </form>

        {!require2FA && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
