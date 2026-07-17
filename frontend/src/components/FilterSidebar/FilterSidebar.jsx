import Input from '../Input/Input.jsx';

export default function FilterSidebar({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  maxPrice = 1000,
  onPriceChange,
  searchValue = '',
  onSearchChange,
  selectedRating = 0,
  onSelectRating,
  inStockOnly = false,
  onToggleAvailability,
}) {
  return (
    <aside className="shop-page__sidebar" aria-label="Product filters">
      <div className="shop-page__filter-group">
        <h3>Search</h3>
        <Input
          label="Search products"
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search products"
        />
      </div>

      <div className="shop-page__filter-group">
        <h3>Category</h3>
        <div className="shop-page__categories">
          <button
            type="button"
            className={`shop-page__category-btn${selectedCategory === 'all' ? ' is-active' : ''}`}
            onClick={() => onSelectCategory?.('all')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`shop-page__category-btn${String(selectedCategory) === String(category.id) ? ' is-active' : ''}`}
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
        <Input
          label="Max price"
          type="number"
          value={maxPrice}
          onChange={(event) => onPriceChange?.(Number(event.target.value || 0))}
          placeholder="Enter max price"
        />
      </div>

      <div className="shop-page__filter-group">
        <h3>Rating</h3>
        <div className="shop-page__rating-options">
          {[0, 4, 4.5, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              className={`shop-page__rating-btn${selectedRating === rating ? ' is-active' : ''}`}
              onClick={() => onSelectRating?.(rating)}
            >
              {rating === 0 ? 'All' : `${rating}+ stars`}
            </button>
          ))}
        </div>
      </div>

      <div className="shop-page__filter-group">
        <h3>Availability</h3>
        <label className="shop-page__availability">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => onToggleAvailability?.(event.target.checked)}
          />
          <span>In stock only</span>
        </label>
      </div>
    </aside>
  );
}
