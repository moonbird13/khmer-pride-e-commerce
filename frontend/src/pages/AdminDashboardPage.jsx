import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductManagement from '../components/ProductManagement/ProductManagement';
import AdminRequests from '../components/AdminRequests/AdminRequests';
import InventoryManagement from '../components/InventoryManagement/InventoryManagement';
import UserManagement from '../components/UserManagement/UserManagement';
import api from '../services/api';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const [section, setSection] = useState('dashboard');
  const [productView, setProductView] = useState('products');
  const [inventoryView, setInventoryView] = useState('inventory');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState('');
  const title = useMemo(() => ({ dashboard: 'Dashboard', products: 'Product management', inventory: 'Inventory', staff: 'Staff', customers: 'Customers' }[section]), [section]);
  const nav = [['dashboard', 'Dashboard'], ['products', 'Products'], ['inventory', 'Inventory'], ['staff', 'Staff'], ['customers', 'Customers']];
  useEffect(() => {
    api.get('/users/dashboard').then(({ data }) => setAnalytics(data)).catch((error) => setAnalyticsError(error?.response?.data?.message || 'Unable to load dashboard analytics.'));
  }, []);
  const cards = analytics ? [
    ['Total Revenue', `$${Number(analytics.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue from non-cancelled orders'],
    ['Total Orders', analytics.totalOrders.toLocaleString(), 'All orders'],
    ['Total Customers', analytics.totalCustomers.toLocaleString(), 'Customer accounts'],
    ['Total Staff', analytics.totalStaff.toLocaleString(), 'Staff accounts'],
    ['Pending Requests', analytics.pendingRequests.toLocaleString(), 'Awaiting admin review'],
    ['Low Stock Products', analytics.lowStockProducts.toLocaleString(), '20 units or fewer'],
  ] : [];
  return <main className="admin-portal">
    <aside className="admin-sidebar">
      <div className="admin-brand"><b>KP</b><span>Khmer Pride<small>Admin portal</small></span></div>
      <p className="admin-nav-label">MENU</p>
      {nav.map(([key, label]) => <button key={key} className={section === key ? 'active' : ''} onClick={() => setSection(key)}>{label}</button>)}
      <div className="admin-account"><strong>Super Admin</strong><Link to="/profile">Edit profile</Link><Link to="/">Log out portal</Link></div>
    </aside>
    <section className="admin-content">
      <header><div><h1>{title}</h1><p>Friday, 19 June 2026</p></div><Link className="admin-profile" to="/profile">Profile</Link></header>
      {section === 'dashboard' && <>{analyticsError ? <p className="admin-dashboard-error">{analyticsError}</p> : !analytics ? <p className="admin-dashboard-loading">Loading business analytics...</p> : <><section className="admin-dashboard-intro"><div><p className="eyebrow">Overview</p><h2>Business Performance</h2><span>Monitor revenue, orders, staffing, approval work, and stock health.</span></div></section><div className="admin-metrics admin-metrics--business">{cards.map(([label, value, note]) => <article key={label}><span>{label}</span><b>{value}</b><em>{note}</em></article>)}</div><section className="admin-dashboard-grid"><article className="admin-panel admin-activity"><h2>Recent activities</h2><p>Latest orders and staff requests</p>{analytics.activities.length === 0 ? <span>No activity yet.</span> : <div>{analytics.activities.map((activity, index) => <div className="activity-item" key={`${activity.type}-${index}`}><i className={`activity-dot activity-dot--${activity.status.toLowerCase()}`} /><div><strong>{activity.title}</strong><span>{activity.type} · {new Date(activity.at).toLocaleString()}</span></div><b>{activity.status}</b></div>)}</div>}</article><article className="admin-panel admin-dashboard-notes"><h2>Attention needed</h2><div><strong>{analytics.pendingRequests}</strong><span>pending staff requests</span></div><div><strong>{analytics.lowStockProducts}</strong><span>products low in stock</span></div></article></section></>}</>}
      {section === 'products' && <><div className="admin-subnav"><button className={productView === 'products' ? 'active' : ''} onClick={() => setProductView('products')}>Products</button><button className={productView === 'requests' ? 'active' : ''} onClick={() => setProductView('requests')}>Product requests</button></div><div className="admin-panel">{productView === 'products' ? <ProductManagement /> : <AdminRequests kind="products" />}</div></>}
      {section === 'inventory' && <><div className="admin-subnav"><button className={inventoryView === 'inventory' ? 'active' : ''} onClick={() => setInventoryView('inventory')}>Inventory</button><button className={inventoryView === 'requests' ? 'active' : ''} onClick={() => setInventoryView('requests')}>Inventory requests</button></div><div className="admin-panel">{inventoryView === 'inventory' ? <InventoryManagement /> : <AdminRequests kind="inventory" />}</div></>}
      {section === 'staff' && <div className="admin-panel"><h2>Staff management</h2><p>Update staff details or passwords. Freeze and delete actions require your admin password.</p><UserManagement role="staff" /></div>}
      {section === 'customers' && <div className="admin-panel"><h2>Customer management</h2><p>Search, filter, review, freeze, or delete customer accounts.</p><UserManagement role="customer" /></div>}
    </section>
  </main>;
}
function Empty({ title, text }) { return <article className="admin-panel admin-empty"><h2>{title}</h2><p>{text}</p><span>Connect this view to the admin API to review live records.</span></article>; }
