import { Link } from 'react-router-dom';
import './Button.css';

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}) {
  const classes = [
    'ui-btn',
    `ui-btn--${variant}`,
    size !== 'md' ? `ui-btn--${size}` : '',
    fullWidth ? 'ui-btn--full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = loading ? (
    <>
      <span className="ui-btn__spinner" aria-hidden="true" />
      <span>{children}</span>
    </>
  ) : (
    children
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
