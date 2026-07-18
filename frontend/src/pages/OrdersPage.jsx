import OrderCard from '../components/OrderCard/OrderCard.jsx';
import { useCart } from '../context/CartContext';

export default function OrdersPage() {
  const { orders, cancelOrder } = useCart();
  const currentOrders = orders.filter((order) => !['Delivered', 'Completed', 'Cancelled'].includes(order.status));
  const pastOrders = orders.filter((order) => ['Delivered', 'Completed', 'Cancelled'].includes(order.status));

  return (
    <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      <h1>My Orders</h1>
      <p style={{ marginBottom: '2rem', color: '#6b7280' }}>View current orders and your past purchases in one place.</p>

      {orders.length === 0 ? (
        <div className="product-card">
          <p>You have not placed any orders yet.</p>
        </div>
      ) : (
        <>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Current orders</h2>
            {currentOrders.length === 0 ? <p>No active orders right now.</p> : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {currentOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onCancel={cancelOrder} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 style={{ marginBottom: '1rem' }}>Past orders</h2>
            {pastOrders.length === 0 ? <p>No past orders yet.</p> : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {pastOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onCancel={cancelOrder} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
