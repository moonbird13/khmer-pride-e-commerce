import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  if (!user || String(user.role).toLowerCase() !== 'admin') {
    return (
      <div className="page-shell">
        <h1>Access denied</h1>
        <p>You need administrator access to view this dashboard.</p>
        <Link className="primary-btn" to="/">Back home</Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Admin dashboard</h1>
          <p className="hero-copy">Monitor products, customers, and order activity from one place.</p>
        </div>
        <div className="page-actions">
          <Link className="secondary-btn" to="/products">Manage catalog</Link>
          <Link className="primary-btn" to="/orders">Review orders</Link>
        </div>
      </div>

      <section className="product-grid">
        <article className="product-card">
          <h3>Products</h3>
          <p>Track stock, update listings, and keep your catalog fresh.</p>
        </article>
        <article className="product-card">
          <h3>Orders</h3>
          <p>Monitor pending payments, fulfillment, and delivery progress.</p>
        </article>
        <article className="product-card">
          <h3>Customers</h3>
          <p>Support returning customers and manage community activity.</p>
        </article>
      </section>
    </div>
  );
}
