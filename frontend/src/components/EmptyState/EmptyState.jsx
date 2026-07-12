export default function EmptyState({ title = 'Nothing here yet', description = 'There is nothing to show right now.', action }) {
  return (
    <div className="ui-card" style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div style={{ marginTop: '1rem' }}>{action}</div> : null}
    </div>
  );
}
