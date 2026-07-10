import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function StaffDashboardPage() {
  const { user } = useAuth();

  if (!user || !['staff', 'admin'].includes(String(user.role).toLowerCase())) {
    return (
      <div className="page-shell">
        <h1>Access denied</h1>
        <p>You need staff access to view this dashboard.</p>
        <Link className="primary-btn" to="/">Back home</Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Staff</p>
          <h1>Staff dashboard</h1>
          <p className="hero-copy">Support customers, manage orders, and assist with day-to-day operations.</p>
        </div>
        <div className="page-actions">
          <Link className="primary-btn" to="/orders">View orders</Link>
          <Link className="secondary-btn" to="/profile">Profile</Link>
        </div>
      </div>

      <section className="product-grid">
        <article className="product-card">
          <h3>Orders queue</h3>
          <p>Review and help fulfill incoming orders quickly.</p>
        </article>
        <article className="product-card">
          <h3>Customer support</h3>
          <p>Respond to service requests with confidence and speed.</p>
        </article>
      </section>
    </div>
  );
}
