import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar.jsx';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import SectionHeader from '../components/SectionHeader';
import CategoryCard from '../components/CategoryCard/CategoryCard.jsx';
import '../pages/HomePage.css';
import { categories as mockCategories } from '../data/categories';
import { products as mockProducts } from '../data/products';
import './ShopPage.css';

const PAGE_SIZE = 6;

export default function Products() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [products] = useState(mockProducts);
  const [categories] = useState(mockCategories.map((category) => ({ id: category.id, name: category.name, image: category.image })));
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, maxPrice, sortBy, selectedRating, inStockOnly]);

  const cat = searchParams.get('category');
  useEffect(() => {
    if (cat && categories.some((c) => String(c.id) === cat) && String(selectedCategory) !== cat) {
      setSelectedCategory(cat);
    }
  }, [cat, categories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    let nextProducts = products
      .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || (product.description || '').toLowerCase().includes(search.toLowerCase()))
      .filter((product) => selectedCategory === 'all' || Number(product.categoryId) === Number(selectedCategory))
      .filter((product) => Number(product.price) <= maxPrice)
      .filter((product) => selectedRating === 0 || (product.rating && Number(product.rating) >= selectedRating))
      .filter((product) => !inStockOnly || Number(product.stock) > 0);

    if (sortBy === 'price-low') nextProducts = [...nextProducts].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') nextProducts = [...nextProducts].sort((a, b) => b.price - a.price);
    else if (sortBy === 'a-z') nextProducts = [...nextProducts].sort((a, b) => a.name.localeCompare(b.name));
    else nextProducts = [...nextProducts];

    return nextProducts;
  }, [maxPrice, search, selectedCategory, sortBy, selectedRating, inStockOnly, products]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const { addToCart } = useCart();
  const handleAddToCart = (product, quantity) => addToCart(product, quantity);

  const visibleCategories = useMemo(() => categories.slice(0, 4), [categories]);

  return (
    <main className="shop-page page-shell">
      <section className="hero-section hero-section--solid">
        <p className="eyebrow">{selectedCategory === 'all' ? 'Products' : (categories.find((c) => String(c.id) === String(selectedCategory))?.name || 'Products')}</p>
        <h1>Browse handcrafted finds from Khmer Pride.</h1>
        <p className="hero-copy">Search by style, filter products by type, and find pieces that fit your routine.</p>
      </section>

      <div className="shop-page__container">
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(categoryId) => {
            setSelectedCategory(categoryId);
            const params = new URLSearchParams(searchParams);
            if (categoryId === 'all') {
              params.delete('category');
            } else {
              params.set('category', String(categoryId));
            }
            setSearchParams(params);
          }}
          maxPrice={maxPrice}
          onPriceChange={setMaxPrice}
          searchValue={search}
          onSearchChange={setSearch}
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
          inStockOnly={inStockOnly}
          onToggleAvailability={setInStockOnly}
        />

        <section className="shop-page__content">
          <div className="shop-page__toolbar shop-page__toolbar--gap">
            <div>
              <span className="shop-page__count">{filteredProducts.length} products found</span>
              <p className="shop-page__hint">Filtered by your preferences.</p>
            </div>
            <label className="shop-page__sort">
              <span>Sort by</span>
              <select className="shop-page__select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="a-z">Name A–Z</option>
              </select>
            </label>
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
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

      <section className="section-block section-block--panel">
        <SectionHeader title="Browse product collections" subtitle="Explore curated products" />
        <div className="category-grid">
          {visibleCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </main>
  );
}
