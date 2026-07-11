import './Loading.css';

export default function Loading({ label = 'Loading...', size = 'md', className = '' }) {
  return (
    <div className={`ui-loading ${className}`.trim()}>
      <span className={`ui-loading__spinner ui-loading__spinner--${size}`} aria-hidden="true" />
      <span className="ui-loading__label">{label}</span>
    </div>
  );
}
