import { useMemo } from 'react';
import './Rating.css';

export default function Rating({
  value = 0,
  max = 5,
  showValue = false,
  readOnly = false,
  size = 'md',
  onChange,
  className = '',
  ...props
}) {
  const normalizedValue = Math.min(Math.max(Number(value) || 0, 0), max);
  const stars = useMemo(() => Array.from({ length: max }, (_, index) => index < normalizedValue), [max, normalizedValue]);

  const handleSelect = (index) => {
    if (!readOnly && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={`ui-rating ${className}`.trim()} {...props}>
      <div className={`ui-rating__stars ui-rating__stars--${size}`} aria-label={`Rating: ${normalizedValue} out of ${max}`}>
        {stars.map((filled, index) => (
          <button
            key={`${filled}-${index}`}
            type="button"
            className={`ui-rating__star${filled ? ' ui-rating__star--filled' : ''}`}
            onClick={() => handleSelect(index)}
            disabled={readOnly}
            aria-label={`Rate ${index + 1} out of ${max}`}
          >
            ★
          </button>
        ))}
      </div>
      {showValue ? <span className="ui-rating__value">{normalizedValue.toFixed(1)} / {max}</span> : null}
    </div>
  );
}
