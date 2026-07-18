import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import { useCart } from '../context/CartContext';

export default function OrderSuccessPage() {
  const location = useLocation();
  const { orders } = useCart();
  const [activeOrder, setActiveOrder] = useState(location.state?.order ?? null);

  useEffect(() => {
    if (location.state?.order) {
      setActiveOrder(location.state.order);
    } else if (orders.length > 0) {
      setActiveOrder(orders[0]);
    }
  }, [location.state, orders]);

  return (
    <main className="page-shell" style={{ maxWidth: '640px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        <p className="eyebrow">Order confirmed</p>
        <h1>Your order has been placed.</h1>
        <p style={{ marginBottom: '1.5rem' }}>
          Your cart has been turned into an order. You can view it in My Orders and cancel it there later if needed.
        </p>

        {activeOrder ? (
          <div style={{ marginBottom: '1.5rem', textAlign: 'left', background: '#f8f7f2', borderRadius: '12px', padding: '1rem' }}>
            <p><strong>Order ID:</strong> #{activeOrder.id}</p>
            <p><strong>Status:</strong> {activeOrder.status}</p>
            <p><strong>Total:</strong> ${Number(activeOrder.total || 0).toFixed(2)}</p>
            <p><strong>Payment:</strong> {activeOrder.paymentMethod || 'Cash on Delivery'} ({activeOrder.paymentStatus || 'Unpaid'})</p>
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button to="/" variant="secondary">Back to homepage</Button>
          <Button to="/orders">View My Orders</Button>
        </div>
      </div>
    </main>
  );
}
