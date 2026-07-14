import { useMemo, useState } from 'react';
import Button from '../Button/Button.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import { getFilterOptions } from '../../utils/productFilters.mjs';
import './ProductFilterBar.css';

export default function ProductFilterBar({
  products = [],
  categories = [],
  searchValue = '',
  selectedCategory = 'all',
  locationValue = 'all',
  priceValue = 'all',
  brandValue = 'all',
  sortValue = 'newest',
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onPriceChange,
  onBrandChange,
  onSortChange,
  className = '',
  countLabel = '',
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { locations, brands, priceRanges } = useMemo(() => getFilterOptions(products), [products]);
  const categoryOptions = useMemo(() => [{ id: 'all', name: 'All categories' }, ...categories], [categories]);

  return (
    <section className={`product-filter-bar ${className}`.trim()} aria-label="Product filters">
      <div className="product-filter-bar__row">
        <div className="product-filter-bar__search">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search products, brands, or categories..."
            name="product-search"
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="product-filter-bar__toggle"
          onClick={() => setIsExpanded((value) => !value)}
          type="button"
        >
          <span aria-hidden="true">⌕</span>
          {isExpanded ? 'Hide filters' : 'Filters'}
        </Button>
      </div>

      <div className={`product-filter-bar__panel${isExpanded ? ' is-open' : ''}`}>
        <label className="product-filter-bar__field">
          <span className="product-filter-bar__label">Category</span>
          <select className="product-filter-bar__select" value={selectedCategory} onChange={(event) => onCategoryChange?.(event.target.value)}>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="product-filter-bar__field">
          <span className="product-filter-bar__label">Location</span>
          <select className="product-filter-bar__select" value={locationValue} onChange={(event) => onLocationChange?.(event.target.value)}>
            <option value="all">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <label className="product-filter-bar__field">
          <span className="product-filter-bar__label">Price range</span>
          <select className="product-filter-bar__select" value={priceValue} onChange={(event) => onPriceChange?.(event.target.value)}>
            {priceRanges.map((priceRange) => (
              <option key={priceRange.value} value={priceRange.value}>
                {priceRange.label}
              </option>
            ))}
          </select>
        </label>

        <label className="product-filter-bar__field">
          <span className="product-filter-bar__label">Brand</span>
          <select className="product-filter-bar__select" value={brandValue} onChange={(event) => onBrandChange?.(event.target.value)}>
            <option value="all">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <label className="product-filter-bar__field">
          <span className="product-filter-bar__label">Sort by</span>
          <select className="product-filter-bar__select" value={sortValue} onChange={(event) => onSortChange?.(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
    </section>
  );
}
