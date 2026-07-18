import { useState } from 'react';
import './StaffDashboardPage.css';
import ProductManagement from '../components/ProductManagement/ProductManagement';
import StaffRequests from '../components/StaffRequests/StaffRequests';

const MENU_ITEMS = [
  { key: 'orders', label: 'Orders' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'product', label: 'Product' },
  { key: 'requests', label: 'Requests' },
];

const DASHBOARD_METRICS = [
  { label: 'Total Revenue', value: '$61,400', subtitle: '+18.4% vs last month' },
  { label: 'Total Orders', value: '6,920', subtitle: '+12.1% vs last month' },
  { label: 'Active Customers', value: '1,284', subtitle: '+5.7% vs last month' },
  { label: 'Avg Order Value', value: '$62.40', subtitle: '-2.3% vs last month' },
];

const ORDERS = [
  {
    id: '#KP-4821',
    customer: 'Sophea Chan',
    status: 'Processing',
    amount: '$24.00',
    time: '10 min ago',
    items: [
      { name: 'Silk Krama Scarf', qty: 1, price: '$24.00' },
    ],
  },
  {
    id: '#KP-4820',
    customer: 'Dara Meng',
    status: 'Shipped',
    amount: '$18.50',
    time: '32 min ago',
    items: [
      { name: 'Jasmine Green Tea', qty: 2, price: '$9.25' },
    ],
  },
  {
    id: '#KP-4819',
    customer: 'Bopha Keo',
    status: 'Delivered',
    amount: '$12.00',
    time: '1h ago',
    items: [
      { name: 'Turmeric Powder', qty: 1, price: '$12.00' },
    ],
  },
];

const STOCK_ITEMS = [
  { sku: 'STK-001', name: 'Silk Krama Scarf', quantity: 48, status: 'In stock' },
  { sku: 'STK-002', name: 'Jasmine Green Tea', quantity: 120, status: 'In stock' },
  { sku: 'STK-003', name: 'Turmeric Powder', quantity: 18, status: 'Low stock' },
  { sku: 'STK-004', name: 'Khmer Gift Box', quantity: 9, status: 'Low stock' },
];

export default function StaffDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <main className="staff-dashboard page-shell">
      <aside className="staff-sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">KP</span>
          <div>
            <p className="sidebar-company">Khmer Pride</p>
            <p className="sidebar-role">Staff Portal</p>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-title">Dashboard</p>
          <button
            type="button"
            className={`sidebar-link${activeSection === 'dashboard' ? ' active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            Overview
          </button>
        </div>

        <div className="sidebar-menu">
          <p className="sidebar-menu-title">Menu</p>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sidebar-link${activeSection === item.key ? ' active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      <section className="staff-content">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <>
            <header className="staff-header">
              <div>
                <p className="eyebrow">Staff Portal</p>
                <h1>Dashboard</h1>
                <p className="staff-subtitle">Orders, stock, and product management in one place.</p>
              </div>
            </header>

            <div className="metrics-grid">
              {DASHBOARD_METRICS.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <p className="metric-label">{metric.label}</p>
                  <h2>{metric.value}</h2>
                  <p className="metric-note">{metric.subtitle}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Orders Section */}
        {activeSection === 'orders' && (
          <div className="panel-block">
            <div className="panel-header">
              <h2>Order Management</h2>
              <p>Click an order to view its details below.</p>
            </div>
            <div className="orders-grid">
              {ORDERS.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card__row">
                    <span className="order-id">{order.id}</span>
                    <span className={`status-pill status-${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  <div className="order-card__row">
                    <p>{order.customer}</p>
                    <p>{order.time}</p>
                  </div>
                  <div className="order-card__row order-card__summary">
                    <strong>{order.amount}</strong>
                    <span>{order.items.length} item(s)</span>
                  </div>
                  <div className="order-details">
                    <p className="order-details__title">Order details</p>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.name}</span>
                        <span>{item.qty} × {item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Section */}
        {activeSection === 'inventory' && (
          <div className="panel-block">
            <div className="panel-header">
              <h2>Inventory</h2>
              <p>Track stock levels and identify low quantity items.</p>
            </div>
            <div className="stock-table">
              <div className="table-row table-row--header">
                <span>SKU</span>
                <span>Product</span>
                <span>Quantity</span>
                <span>Status</span>
              </div>
              {STOCK_ITEMS.map((item) => (
                <div key={item.sku} className="table-row">
                  <span>{item.sku}</span>
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                  <span>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Management Section */}
        {activeSection === 'product' && (
          <div className="panel-block">
            <ProductManagement />
          </div>
        )}

        {/* Staff Requests Section */}
        {activeSection === 'requests' && (
          <div className="panel-block">
            <StaffRequests />
          </div>
        )}
      </section>
    </main>
  );
}
