export default function OrderCard({ order }) {
  return (
    <article className="ui-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
        <div>
          <h3>Order {order.id}</h3>
          <p className="ui-card__meta">{order.createdAt}</p>
        </div>
        <span className="ui-card__meta">{order.status}</span>
      </div>
      <ul>
        {(order.items || []).map((item, index) => (
          <li key={`${order.id}-${index}`}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: '0.75rem', fontWeight: 700 }}>Total: ${Number(order.total || 0).toFixed(2)}</p>
    </article>
  );
}
