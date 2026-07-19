import { useEffect, useMemo, useState } from 'react';
import './StaffDashboardPage.css';
import ProductManagement from '../components/ProductManagement/ProductManagement';
import StaffRequests from '../components/StaffRequests/StaffRequests';
import InventoryManagement from '../components/InventoryManagement/InventoryManagement';
import api, { getProducts } from '../services/api';

const MENU_ITEMS = [
  { key: 'orders', label: 'Orders' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'product', label: 'Product' },
  { key: 'requests', label: 'Requests' },
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

export default function StaffDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [requestedInventoryProduct, setRequestedInventoryProduct] = useState(null);
  const [dashboardData, setDashboardData] = useState({ orders: [], products: [], requests: { inventory: [], products: [] } });
  const [dashboardError, setDashboardError] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const pageTitle = { dashboard: 'Dashboard', orders: 'Orders', inventory: 'Inventory', product: 'Product Management', requests: 'Requests' }[activeSection];

  const openInventoryRequest = (product) => {
    setRequestedInventoryProduct(product);
    setActiveSection('requests');
  };

  useEffect(() => {
    Promise.all([api.get('/orders'), getProducts(), api.get('/requests/mine')])
      .then(([ordersResponse, productsResponse, requestsResponse]) => setDashboardData({
        orders: ordersResponse.data || [],
        products: Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [],
        requests: requestsResponse.data || { inventory: [], products: [] },
      }))
      .catch((error) => setDashboardError(error?.response?.data?.message || 'Unable to load staff dashboard data.'));
  }, []);

  const dashboard = useMemo(() => {
    const today = new Date().toDateString();
    const requests = [...dashboardData.requests.inventory, ...dashboardData.requests.products];
    const activities = [
      ...dashboardData.orders.map((order) => ({ title: `Order #${order.id} is ${order.status}`, at: order.createdAt, status: order.status })),
      ...requests.map((request) => ({ title: `${request.requestType || 'Inventory'} request is ${request.status}`, at: request.reviewedAt || request.requestedAt, status: request.status })),
    ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6);
    return {
      todaysOrders: dashboardData.orders.filter((order) => new Date(order.createdAt).toDateString() === today).length,
      pendingOrders: dashboardData.orders.filter((order) => ['Pending', 'Processing'].includes(order.status)).length,
      lowStock: dashboardData.products.filter((product) => Number(product.quantity || 0) <= 20).length,
      pendingRequests: requests.filter((request) => request.status === 'Pending').length,
      activities,
    };
  }, [dashboardData]);
  const dashboardMetrics = [
    ['Today’s Orders', dashboard.todaysOrders, 'Orders received today'],
    ['Pending Orders', dashboard.pendingOrders, 'Need processing'],
    ['Low Stock Products', dashboard.lowStock, '20 units or fewer'],
    ['My Pending Requests', dashboard.pendingRequests, 'Awaiting admin review'],
  ];
  const visibleOrders = dashboardData.orders.filter((order) => (!orderStatusFilter || order.status === orderStatusFilter) && String(order.id).includes(orderSearch.trim()));
  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setDashboardData((previous) => ({ ...previous, orders: previous.orders.map((order) => order.id === orderId ? { ...order, status } : order) }));
      if (selectedOrder?.id === orderId) setSelectedOrder((order) => ({ ...order, status }));
    } catch (error) { setDashboardError(error?.response?.data?.message || 'Unable to update the order status.'); }
  };

  return (
    <main className="staff-dashboard">
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
        <header className="staff-header">
          <div><h1>{pageTitle}</h1><p>Staff Portal</p></div>
          <span className="staff-account-label">Staff</span>
        </header>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <>
            {dashboardError ? <p className="staff-dashboard-error">{dashboardError}</p> : <><section className="staff-dashboard-intro"><p>Operations overview</p><h2>Today Task Overview</h2><span>Track orders, inventory, and your pending requests.</span></section><div className="metrics-grid">
              {dashboardMetrics.map(([label, value, subtitle]) => (
                <div key={label} className="metric-card">
                  <p className="metric-label">{label}</p>
                  <h2>{value}</h2>
                  <p className="metric-note">{subtitle}</p>
                </div>
              ))}
            </div><section className="staff-activity panel-block"><div className="panel-header"><div><h2>Recent Activities</h2><p>Latest orders and your request updates.</p></div></div>{dashboard.activities.length === 0 ? <p>No recent activity.</p> : dashboard.activities.map((activity, index) => <div className="staff-activity-item" key={`${activity.title}-${index}`}><i /><div><strong>{activity.title}</strong><span>{new Date(activity.at).toLocaleString()}</span></div><b>{activity.status}</b></div>)}</section></>}
          </>
        )}

        {/* Orders Section */}
        {activeSection === 'orders' && (
          <div className="panel-block">
            <div className="panel-header">
              <h2>Order Management</h2>
              <p>Search, filter, view, and update customer orders.</p>
            </div>
            <div className="order-controls"><input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Search by order number" /><select value={orderStatusFilter} onChange={(event) => setOrderStatusFilter(event.target.value)}><option value="">All statuses</option>{['Pending', 'Processing', 'OutForDelivery', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></div>
            <div className="orders-grid">
              {visibleOrders.map((order) => <div key={order.id} className="order-card"><div className="order-card__row"><span className="order-id">Order #{order.id}</span><span className={`status-pill status-${order.status.toLowerCase()}`}>{order.status}</span></div><div className="order-card__row"><strong>${Number(order.total).toFixed(2)}</strong><span>{new Date(order.createdAt).toLocaleString()}</span></div><div className="order-card__row order-card__summary"><span>{order.items.length} item(s)</span><button className="order-view-button" onClick={() => setSelectedOrder(order)}>View details</button></div><select className="order-status-select" value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>{['Pending', 'Processing', 'OutForDelivery', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></div>)}
              {false && ORDERS.map((order) => (
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
            {selectedOrder && <div className="order-modal"><article><button onClick={() => setSelectedOrder(null)} aria-label="Close order details">×</button><h3>Order #{selectedOrder.id}</h3><p>Status: <strong>{selectedOrder.status}</strong></p><p>Total: <strong>${Number(selectedOrder.total).toFixed(2)}</strong></p><div>{selectedOrder.items.map((item, index) => <p key={index}>Product #{item.productId} — {item.quantity} × ${Number(item.price).toFixed(2)}</p>)}</div></article></div>}
          </div>
        )}

        {/* Inventory Section */}
        {activeSection === 'inventory' && (
          <div className="panel-block">
            <InventoryManagement onRequestStock={openInventoryRequest} />
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
            <StaffRequests initialInventoryProduct={requestedInventoryProduct} />
          </div>
        )}
      </section>
    </main>
  );
}
