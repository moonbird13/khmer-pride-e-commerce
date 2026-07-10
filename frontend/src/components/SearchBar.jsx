export default function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  return (
    <label className="search-bar">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
