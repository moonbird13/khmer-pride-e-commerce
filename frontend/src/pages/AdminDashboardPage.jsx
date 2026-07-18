import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductManagement from '../components/ProductManagement/ProductManagement';
import './AdminDashboardPage.css';

const cards = [
  ['Total revenue', '$112,400', '+18.4% this month'],
  ['Total orders', '6,920', '+12.1% this month'],
  ['Active customers', '1,284', '+5.7% this month'],
  ['Average order value', '$62.40', '-2.3% this month'],
];

export default function AdminDashboardPage() {
  const [section, setSection] = useState('dashboard');
  const title = useMemo(() => ({ dashboard: 'Dashboard', products: 'Product management', requests: 'Product requests', inventory: 'Inventory requests', staff: 'Staff', customers: 'Customers' }[section]), [section]);
  const nav = [['dashboard', 'Dashboard'], ['products', 'Products'], ['requests', 'Product requests'], ['inventory', 'Inventory'], ['staff', 'Staff'], ['customers', 'Customers']];
  return <main className="admin-portal">
    <aside className="admin-sidebar">
      <div className="admin-brand"><b>KP</b><span>Khmer Pride<small>Admin portal</small></span></div>
      <p className="admin-nav-label">MENU</p>
      {nav.map(([key, label]) => <button key={key} className={section === key ? 'active' : ''} onClick={() => setSection(key)}>{label}</button>)}
      <div className="admin-account"><strong>Super Admin</strong><Link to="/profile">Edit profile</Link><Link to="/">Log out portal</Link></div>
    </aside>
    <section className="admin-content">
      <header><div><h1>{title}</h1><p>Friday, 19 June 2026</p></div><Link className="admin-profile" to="/profile">Profile</Link></header>
      {section === 'dashboard' && <><div className="admin-metrics">{cards.map(([label, value, note]) => <article key={label}><span>{label}</span><b>{value}</b><em className={note.startsWith('-') ? 'down' : ''}>{note}</em></article>)}</div><article className="admin-panel chart"><h2>Revenue overview</h2><p>Monthly revenue, FY 2024</p><div className="chart-line" /><div className="months">Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec</div></article><div className="admin-lower"><article className="admin-panel"><h2>Sales by category</h2><div className="bars"><i /><i /><i /><i /><i /></div></article><article className="admin-panel"><h2>Recent orders</h2><p>#8841 &nbsp; Tom Brennan <b>$42.00</b></p><p>#8840 &nbsp; Yuki Tanaka <b>$28.50</b></p><p>#8839 &nbsp; Amelia Foster <b>$16.50</b></p></article></div></>}
      {section === 'products' && <div className="admin-panel"><ProductManagement /></div>}
      {section === 'requests' && <Empty title="Product requests" text="Staff add and delete requests will appear here for approval." />}
      {section === 'inventory' && <Empty title="Inventory requests" text="Review restock quantities sent by staff after out-of-system restocking." />}
      {section === 'staff' && <Empty title="Staff management" text="Manage staff accounts, email addresses, and passwords here." />}
      {section === 'customers' && <Empty title="Customer management" text="Manage customer account status, including frozen and inactive accounts." />}
    </section>
  </main>;
}
function Empty({ title, text }) { return <article className="admin-panel admin-empty"><h2>{title}</h2><p>{text}</p><span>Connect this view to the admin API to review live records.</span></article>; }
