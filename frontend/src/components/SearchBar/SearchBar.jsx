import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search products...', className = '', name = 'search' }) {
  return (
    <label className={`ui-search ${className}`.trim()}>
      <svg className="ui-search__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </svg>
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
