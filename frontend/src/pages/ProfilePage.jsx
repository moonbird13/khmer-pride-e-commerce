import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePassword, getFavorites, updateProfile } from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileCurrentPassword, setProfileCurrentPassword] = useState('');
  const [passwordCurrentPassword, setPasswordCurrentPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.role === 'customer') {
      const loadFavorites = async () => {
        try {
          const favorites = await getFavorites();
          setFavoritesCount(Array.isArray(favorites) ? favorites.length : 0);
        } catch (error) {
          setFavoritesCount(0);
        }
      };
      loadFavorites();
    }
  }, [user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    setMenuOpen((current) => !current);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('currentPassword', profileCurrentPassword);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await updateProfile(formData);
      setMessage(response.message || 'Profile updated successfully.');
      setProfileCurrentPassword('');
      if (response.user && setUser) {
        setUser(response.user);
        localStorage.setItem('khmer-pride-user', JSON.stringify(response.user));
        setAvatarPreview(response.user.avatarUrl || avatarPreview);
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || error?.message || 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');

    if (!passwordCurrentPassword || !newPassword) {
      setPasswordMessage('Current password and new password are required.');
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New password and confirmation do not match.');
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await changePassword(passwordCurrentPassword, newPassword);
      setPasswordMessage(response.message || 'Password updated successfully.');
      setPasswordCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage(error?.response?.data?.message || error?.message || 'Unable to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleViewAvatar = () => {
    setViewerOpen(true);
    setMenuOpen(false);
  };

  const handleUploadAvatar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setMenuOpen(false);
  };

  const isCustomer = user?.role === 'customer';

  return (
    <main className="profile-page page-shell">
      <div className="profile-shell">
        <div className="profile-header">
          <div className="profile-avatar-menu" ref={menuRef}>
            <button type="button" className="profile-avatar-wrap" onClick={handleAvatarClick}>
              {avatarPreview ? (
                <img className="profile-avatar" src={avatarPreview} alt="Profile avatar" />
              ) : (
                <div className="profile-avatar-placeholder">👤</div>
              )}
            </button>
            {menuOpen ? (
              <div className="profile-avatar-dropdown">
                <button type="button" className="dropdown-item" onClick={handleViewAvatar}>
                  View picture
                </button>
                <button type="button" className="dropdown-item" onClick={handleUploadAvatar}>
                  Upload / update picture
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <h1>My Profile</h1>
            <p>Manage your account settings and profile details.</p>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleProfileSubmit}>
          {message ? <div className="profile-message">{message}</div> : null}

          <label className="profile-field">
            <span>Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>

          <label className="profile-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your.email@example.com"
            />
          </label>

          <label className="profile-field">
            <span>Phone number</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="012345678"
            />
          </label>

          <label className="profile-field">
            <span>Current password</span>
            <input
              type="password"
              value={profileCurrentPassword}
              onChange={(event) => setProfileCurrentPassword(event.target.value)}
              placeholder="Enter current password to save changes"
            />
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="profile-file-input"
          />

          <button type="submit" className="ui-btn ui-btn--primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        {isCustomer ? (
          <section className="profile-account-section">
            <div className="section-header">
              <h2>Security</h2>
            </div>
            <form className="profile-form" onSubmit={handlePasswordSubmit}>
              {passwordMessage ? <div className="profile-message">{passwordMessage}</div> : null}

              <label className="profile-field">
                <span>Current password</span>
                <input
                  type="password"
                  value={passwordCurrentPassword}
                  onChange={(event) => setPasswordCurrentPassword(event.target.value)}
                  placeholder="Current password"
                  required
                />
              </label>

              <label className="profile-field">
                <span>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="New password"
                  required
                />
              </label>

              <label className="profile-field">
                <span>Confirm new password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </label>

              <button type="submit" className="ui-btn ui-btn--secondary" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>

            <div className="profile-quick-links">
              <Link className="profile-card" to="/orders">
                <p>Order History</p>
                <strong>{user?.role === 'customer' ? 'View past orders' : 'Customer orders'}</strong>
              </Link>
              <Link className="profile-card" to="/favorites">
                <p>Favorite</p>
                <strong>{favoritesCount} saved products</strong>
              </Link>
            </div>
          </section>
        ) : null}
      </div>

      {viewerOpen ? (
        <div className="profile-viewer-overlay" onClick={() => setViewerOpen(false)}>
          <div className="profile-viewer-content" onClick={(event) => event.stopPropagation()}>
            <img src={avatarPreview || '/default-avatar.png'} alt="Profile preview" />
            <button type="button" className="ui-btn ui-btn--secondary" onClick={() => setViewerOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
