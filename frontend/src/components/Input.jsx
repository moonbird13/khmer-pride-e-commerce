export default function Input({ label, id, type = 'text', className = '', ...props }) {
  const fieldId = id || props.name;

  return (
    <label className={`form-field ${className}`.trim()} htmlFor={fieldId}>
      {label ? <span className="form-label">{label}</span> : null}
      <input id={fieldId} type={type} {...props} />
    </label>
  );
}
