import Button from '../Button/Button.jsx';

export default function OrderCard({ order, onCancel }) {
  const canCancel = !['Delivered', 'Completed', 'Cancelled'].includes(order.status || '');

  return (
    <article className="ui-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
        <div>
          <h3>Order #{order.id}</h3>
          <p className="ui-card__meta">{order.createdAt}</p>
        </div>
        <span className="ui-card__meta">{order.status}</span>
      </div>
      <ul>
        {(order.items || []).map((item, index) => (
          <li key={`${order.id}-${index}`}>
            {item.name || item.product?.name || 'Item'} × {item.quantity || 1}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: '0.75rem', fontWeight: 700 }}>Total: ${Number(order.total || 0).toFixed(2)}</p>
      <p style={{ marginTop: '0.35rem', color: '#6b7280' }}>
        Payment: {order.paymentMethod || 'Cash on Delivery'} • {order.paymentStatus || 'Unpaid'}
      </p>
      {canCancel ? (
        <div style={{ marginTop: '1rem' }}>
          <Button variant="secondary" onClick={() => onCancel?.(order.id)}>Cancel order</Button>
        </div>
      ) : null}
    </article>
  );
}
