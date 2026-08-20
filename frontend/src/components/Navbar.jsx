import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sun, Moon, Calendar, LogOut, LogIn, Camera } from 'lucide-react';

const Navbar = ({ theme, toggleTheme, user, onOpenAuth, onLogout, onOpenAvatar }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  return (
    <header className="navbar glass-panel">
      <div className="brand">
        <div className="brand-icon">
          <CheckCircle2 size={26} />
        </div>
        <div className="brand-text">
          <h1>To-do Application</h1>
          <p>Custom simple to-do application</p>
        </div>
      </div>

      <div className="nav-actions">
        <div className="date-badge">
          <Calendar size={15} />
          <span>{currentDate}</span>
        </div>

        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.4rem 0.9rem 0.4rem 0.5rem',
                borderRadius: '25px'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  overflow: 'hidden'
                }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name ? user.name.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '125%',
                  width: '230px',
                  padding: '0.75rem',
                  zIndex: 9999,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ padding: '0.4rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAvatar();
                    }}
                    title="Click to change profile photo"
                    style={{
                      position: 'relative',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user.name ? user.name.charAt(0).toUpperCase() : 'U'
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="avatar-hover">
                      <Camera size={14} color="#fff" />
                    </div>
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenAvatar();
                  }}
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    padding: '0.55rem',
                    textAlign: 'left',
                    color: '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}
                >
                  <Camera size={16} />
                  Change Profile Photo
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    padding: '0.55rem',
                    textAlign: 'left',
                    color: '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onOpenAuth} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LogIn size={18} />
            Sign In / Up
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
