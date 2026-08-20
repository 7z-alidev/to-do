import React, { useState } from 'react';
import { authApi } from '../services/api';
import { Camera, Image, Check, X } from 'lucide-react';

const AvatarModal = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.updateAvatar(avatarUrl);
      if (res.success) {
        onUpdateUser({ ...user, avatar: avatarUrl });
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update avatar photo');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = document.createElement('img');
      const reader = new FileReader();
      reader.onload = (evt) => {
        img.src = evt.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.8 quality (~30KB)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setAvatarUrl(compressedBase64);
          setError('');
        };
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '420px', textAlign: 'center' }}>
        <div className="modal-header">
          <h2>Update Profile Picture</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && (
          <div className="atlas-banner error-banner" style={{ margin: '1rem 0' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ margin: '1.5rem 0' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                overflow: 'hidden',
                border: '3px solid var(--accent-primary)',
                boxShadow: '0 8px 20px var(--accent-glow)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '2.5rem',
                color: 'white'
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>

            <label
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <Camera size={16} />
              Upload Image from Computer
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or choose from default avatars:</label>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', margin: '0.6rem 0 1.2rem' }}>
              {defaultAvatars.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Avatar ${idx + 1}`}
                  onClick={() => {
                    setAvatarUrl(imgUrl);
                    setError('');
                  }}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    border: avatarUrl === imgUrl ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    boxShadow: avatarUrl === imgUrl ? '0 0 10px var(--accent-glow)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Image URL (Optional)</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://example.com/photo.jpg"
              value={avatarUrl}
              onChange={(e) => {
                setAvatarUrl(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile Photo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvatarModal;
