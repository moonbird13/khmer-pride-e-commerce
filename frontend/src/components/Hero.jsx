export default function Hero({ eyebrow, title, description, actions, children, media }) {
  return (
    <header className={`hero-section${media ? ' hero-section--split' : ''}`}>
      <div className="hero-section__content">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {title ? <h1>{title}</h1> : null}
        {description ? <p className="hero-copy">{description}</p> : null}
        {actions ? <div className="hero-actions">{actions}</div> : null}
        {children}
      </div>
      {media ? <div className="hero-section__media" aria-hidden="true">{media}</div> : null}
    </header>
  );
}
