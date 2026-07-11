import './QuantitySelector.css';

export default function QuantitySelector({ value = 1, min = 1, max = 10, onChange, className = '' }) {
  const handleChange = (nextValue) => {
    const safeValue = Math.min(Math.max(nextValue, min), max);
    onChange?.(safeValue);
  };

  return (
    <div className={`ui-quantity-selector ${className}`.trim()}>
      <button type="button" onClick={() => handleChange(value - 1)} disabled={value <= min}>
        −
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => handleChange(value + 1)} disabled={value >= max}>
        +
      </button>
    </div>
  );
}
