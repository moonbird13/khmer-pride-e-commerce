import Input from '../Input/Input.jsx';

export default function FilterSidebar({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  maxPrice = 1000,
  onPriceChange,
  searchValue = '',
  onSearchChange,
}) {
  return (
    <aside className="shop-page__sidebar" aria-label="Product filters">
      <div className="shop-page__filter-group">
        <h3>Search</h3>
        <input
          className="ui-input__field"
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search products"
        />
      </div>

      <div className="shop-page__filter-group">
        <h3>Category</h3>
        <div className="shop-page__categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`shop-page__category-btn${selectedCategory === category.id ? ' is-active' : ''}`}
              onClick={() => onSelectCategory?.(category.id)}
              type="button"
            >
              <span className="category-icon">{category.image || '🛍️'}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="shop-page__filter-group">
        <h3>Price range</h3>
        <div className="shop-page__price-input">
          <Input label="Max price" type="number" value={maxPrice} onChange={(event) => onPriceChange?.(Number(event.target.value || 0))} />
        </div>
      </div>
    </aside>
  );
}
