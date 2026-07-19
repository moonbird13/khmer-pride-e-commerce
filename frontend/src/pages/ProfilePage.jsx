import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName || '');
    setEmail(user?.email || '');
    setAvatarPreview(user?.avatarUrl || null);
  }, [user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const profileData = new FormData();
      profileData.append('fullName', fullName);
      profileData.append('email', email);
      if (avatarFile) profileData.append('avatar', avatarFile);
      const response = await updateProfile(profileData);
      const updatedUser = response.user;
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('khmer-pride-user', JSON.stringify(updatedUser));
      }
      setMessage(response.message || 'Profile updated successfully.');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="profile-page page-shell">
      <section className="profile-shell">
        <header className="profile-header profile-header--with-settings">
          <div className="profile-heading-with-avatar">
            <button type="button" className="profile-avatar-wrap" onClick={() => fileInputRef.current?.click()} aria-label="Choose profile picture" title="Choose profile picture">
              {avatarPreview ? <img className="profile-avatar" src={avatarPreview} alt="Profile avatar" /> : <span className="profile-avatar-placeholder" aria-hidden="true">👤</span>}
            </button>
            <div>
              <h1>{user?.fullName || fullName || 'My Profile'}</h1>
              <p>Manage your profile details.</p>
            </div>
          </div>
          <Link className="profile-settings-link" to="/settings" aria-label="Account settings" title="Account settings">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20.3h-3v-.08A1.7 1.7 0 0 0 10.68 18.66a1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7.02 15a1.7 1.7 0 0 0-1.56-1.03h-.08v-3h.08A1.7 1.7 0 0 0 7.02 9.94 1.7 1.7 0 0 0 6.68 8.06L6.62 8 8.74 5.88l.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V4.64h3v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.8 8l-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.08v3h-.08A1.7 1.7 0 0 0 19.4 15Z" />
            </svg>
          </Link>
        </header>

        <form className="profile-form" onSubmit={handleSubmit}>
          {message ? <div className="profile-message">{message}</div> : null}
          <input ref={fileInputRef} className="profile-file-input" type="file" accept="image/*" onChange={handleAvatarChange} />
          <label className="profile-field"><span>Name</span><input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label>
          <label className="profile-field"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <button type="submit" className="ui-btn ui-btn--primary" disabled={loading}>{loading ? 'Saving...' : 'Save profile'}</button>
        </form>
      </section>
    </main>
  );
}
