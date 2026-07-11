import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import SectionHeader from '../components/SectionHeader';
import { categories, products } from '../data/mockData';
import './ShopPage.css';

const PAGE_SIZE = 6;

export default function Products() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, maxPrice, sortBy]);

  // initialize category from URL search param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const exists = categories.some((c) => c.id === cat);
      setSelectedCategory(exists ? cat : 'all');
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let nextProducts = products
      .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase()))
      .filter((product) => selectedCategory === 'all' || product.category === selectedCategory)
      .filter((product) => product.price <= maxPrice);

    if (sortBy === 'price-low') nextProducts = nextProducts.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') nextProducts = nextProducts.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') nextProducts = [...nextProducts]; // keep defined order as "newest"
    else nextProducts = nextProducts.sort((a, b) => a.name.localeCompare(b.name));

    return nextProducts;
  }, [maxPrice, search, selectedCategory, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="shop-page page-shell">
      <section className="hero-section">
        <p className="eyebrow">{selectedCategory === 'all' ? 'Products' : (categories.find((c) => c.id === selectedCategory)?.name || 'Products')}</p>
        <h1>Browse handcrafted finds from Khmer Pride.</h1>
        <p className="hero-copy">Search by style, filter products by type, and find pieces that fit your routine.</p>
      </section>

      <div className="shop-page__container">
        <aside className="shop-page__sidebar" aria-label="Product filters">
          <div className="shop-page__filter-group">
            <h3>Search</h3>
            <SearchBar value={search} onChange={setSearch} placeholder="Search products" />
          </div>

          <div className="shop-page__filter-group">
            <h3>Product type</h3>
            <div className="shop-page__categories">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`shop-page__category-btn${selectedCategory === category.id ? ' is-active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    // update URL param so selection is shareable
                    if (category.id === 'all') {
                      searchParams.delete('category');
                      setSearchParams(searchParams);
                    } else {
                      setSearchParams({ ...Object.fromEntries(searchParams), category: category.id });
                    }
                  }}
                >
                  <span className="category-icon">{category.image}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-page__filter-group">
            <h3>Price range</h3>
            <div className="shop-page__price-input">
              <label>Max price</label>
              <Input type="number" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value || 0))} />
            </div>
          </div>
        </aside>

        <section className="shop-page__content">
          <div className="shop-page__toolbar">
            <span className="shop-page__count">{filteredProducts.length} products found</span>
            <label className="shop-page__sort">
              <span>Sort by</span>
              <select className="shop-page__select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="shop-page__pagination">
            <div className="pagination">
              <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
              <span className="pagination__info">Page {page} / {pageCount}</span>
              <Button variant="secondary" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
