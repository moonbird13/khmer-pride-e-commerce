export default function Hero({ eyebrow, title, description, actions, children }) {
  return (
    <header className="hero-section">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {title ? <h1>{title}</h1> : null}
        {description ? <p className="hero-copy">{description}</p> : null}
        {actions ? <div className="hero-actions">{actions}</div> : null}
        {children}
      </div>
    </header>
  );
}
