import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search products...', className = '', name = 'search' }) {
  return (
    <label className={`ui-search ${className}`.trim()}>
      <span className="ui-search__icon" aria-hidden="true">🔍</span>
      <input
        className="ui-search__input"
        type="search"
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
