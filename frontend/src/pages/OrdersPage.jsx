import OrderCard from '../components/OrderCard/OrderCard.jsx';
import { useCart } from '../context/CartContext';

export default function OrdersPage() {
  const { orders } = useCart();

  return (
    <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      <h1>Orders</h1>
      {orders.length === 0 ? <p>No orders yet.</p> : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
