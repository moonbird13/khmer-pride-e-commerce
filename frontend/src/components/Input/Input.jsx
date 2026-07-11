import './Input.css';

export default function Input({ label, id, type = 'text', className = '', error = '', hint = '', ...props }) {
  const fieldId = id || props.name;

  return (
    <div className={`ui-input ${error ? 'ui-input--error' : ''} ${className}`.trim()}>
      {label ? (
        <label className="ui-input__label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <input id={fieldId} className="ui-input__field" type={type} {...props} />
      {error ? <p className="ui-input__hint">{error}</p> : hint ? <p className="ui-input__hint">{hint}</p> : null}
    </div>
  );
}
