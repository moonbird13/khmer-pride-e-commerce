import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="page-shell">
        <h1>Profile</h1>
        <p>Please log in to view your account information.</p>
        <Link className="primary-btn" to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Welcome back, {user.fullName || user.name || 'friend'}.</h1>
          <p className="hero-copy">Manage your account details and keep track of your orders in one place.</p>
        </div>
        <div className="page-actions">
          <Link className="secondary-btn" to="/orders">My orders</Link>
          <button className="secondary-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <section className="product-card">
        <h2>Profile details</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role || 'Customer'}</p>
        <p><strong>Status:</strong> Active</p>
      </section>
    </div>
  );
}
