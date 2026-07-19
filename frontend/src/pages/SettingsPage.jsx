import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/api';
import './ProfilePage.css';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const canChangePassword = ['admin', 'customer'].includes(user?.role);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await changePassword(currentPassword, newPassword);
      setMessage(response.message || 'Password updated successfully. You will now be signed out.');
      await logout();
      navigate('/login', { replace: true, state: { message: 'Password updated successfully. Please sign in again.' } });
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="profile-page page-shell"><section className="profile-shell">
    <header className="profile-header profile-header--with-settings"><div><h1>Settings</h1><p>Account security settings.</p></div><Link className="profile-settings-link" to="/profile" aria-label="Back to profile" title="Back to profile">←</Link></header>
    {canChangePassword ? <section className="settings-section"><h2>Change Password</h2><form className="profile-form" onSubmit={handleSubmit}>
      {message ? <div className="profile-message">{message}</div> : null}
      <label className="profile-field"><span>Current Password</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label>
      <label className="profile-field"><span>New Password</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label>
      <label className="profile-field"><span>Confirm New Password</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label>
      <button type="submit" className="ui-btn ui-btn--primary" disabled={loading}>{loading ? 'Changing...' : 'Change Password'}</button>
    </form></section> : null}
  </section></main>;
}
