import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { useAuth } from '../contexts/AuthContext';

export default function OrdersPage() {
  const { api } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to load orders', error);
      }
    };

    loadOrders();
  }, [api]);

  return (
    <div className="page-shell">
      <Hero eyebrow="Orders" title="Your orders" description="Track the status of your recent purchases." />
      {orders.length === 0 ? (
        <div className="product-card">
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="product-grid">
          {orders.map((order) => (
            <article key={order.id} className="product-card">
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
