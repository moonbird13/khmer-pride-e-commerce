export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="section-header">
      <div>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        <h2>{title}</h2>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
