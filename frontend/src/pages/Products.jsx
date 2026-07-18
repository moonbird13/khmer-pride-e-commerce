import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar.jsx';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import SectionHeader from '../components/SectionHeader';
import CategoryCard from '../components/CategoryCard/CategoryCard.jsx';
import '../pages/HomePage.css';
import api, { addFavorite, getFavorites, removeFavorite } from '../services/api';
import './ShopPage.css';

const PAGE_SIZE = 6;

const normalizeProducts = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeCategories = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
        ]);

        const nextCategories = normalizeCategories(categoriesResponse.data);
        const nextProducts = normalizeProducts(productsResponse.data);

        setCategories(nextCategories.map((category) => ({
          id: category.id ?? category.categoryId,
          name: category.name ?? category.categoryName,
          image: category.image ?? category.imageUrl ?? null,
        })));

        setProducts(nextProducts.map((product) => ({
          id: product.id ?? product.productId ?? product._id,
          name: product.name ?? product.productName,
          description: product.description ?? product.productDescription,
          price: Number(product.price ?? product.productPrice ?? 0),
          categoryId: product.categoryId ?? product.category?.id,
          category: product.category ?? (product.Category ? { id: product.Category.categoryId, name: product.Category.categoryName } : null),
          isFeatured: Boolean(product.isFeatured),
          isBestSeller: Boolean(product.isBestSeller),
          isNewArrival: Boolean(product.isNewArrival),
          image: product.image ?? product.imageUrl ?? null,
        })));
      } catch (error) {
        console.error('Failed to load products data.', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, maxPrice, sortBy]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.some((c) => c.id === cat) && selectedCategory !== cat) {
      setSelectedCategory(cat);
    }
  }, [categories, searchParams, selectedCategory]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user || user.role !== 'customer') {
        setFavoriteIds(new Set());
        return;
      }

      try {
        const favorites = await getFavorites();
        setFavoriteIds(new Set(favorites.map((item) => String(item.id))));
      } catch (error) {
        console.error('Failed to load favorite ids.', error);
      }
    };

    loadFavorites();
  }, [user]);

  const filteredProducts = useMemo(() => {
    let nextProducts = products
      .filter((product) => (product.name || '').toLowerCase().includes(search.toLowerCase()) || (product.description || '').toLowerCase().includes(search.toLowerCase()))
      .filter((product) => selectedCategory === 'all' || Number(product.categoryId) === Number(selectedCategory))
      .filter((product) => Number(product.price) <= maxPrice);

    if (sortBy === 'price-low') nextProducts = nextProducts.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') nextProducts = nextProducts.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') nextProducts = [...nextProducts]; // keep defined order as "newest"
    else nextProducts = nextProducts.sort((a, b) => a.name.localeCompare(b.name));

    return nextProducts;
  }, [products, maxPrice, search, selectedCategory, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const { addToCart } = useCart();
  const handleAddToCart = (product, quantity) => addToCart(product, quantity);

  const handleToggleFavorite = async (product) => {
    if (!product?.id || !user || user.role !== 'customer') return;

    const productId = String(product.id);
    const isFavorited = favoriteIds.has(productId);

    setFavoriteIds((current) => {
      const next = new Set(current);
      if (isFavorited) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      if (isFavorited) {
        await removeFavorite(product.id);
      } else {
        await addFavorite(product.id);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to save this favorite. Please log in again and retry.';
      console.error('Failed to update favorite.', error);
      window.alert(message);
      setFavoriteIds((current) => {
        const next = new Set(current);
        if (isFavorited) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  };

  // show all categories in the "Browse categories" section
  const visibleCategories = useMemo(() => categories, [categories]);

  return (
    <main className="shop-page page-shell">
      <section className="hero-section">
        <p className="eyebrow">{selectedCategory === 'all' ? 'Products' : (categories.find((c) => c.id === selectedCategory)?.name || 'Products')}</p>
        <h1>Browse handcrafted finds from Khmer Pride.</h1>
        <p className="hero-copy">Search by style, filter products by type, and find pieces that fit your routine.</p>
      </section>

      <div className="shop-page__container">
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(categoryId) => {
            setSelectedCategory(categoryId);
            if (categoryId === 'all') {
              searchParams.delete('category');
              setSearchParams(searchParams);
            } else {
              setSearchParams({ ...Object.fromEntries(searchParams), category: String(categoryId) });
            }
          }}
          maxPrice={maxPrice}
          onPriceChange={setMaxPrice}
          searchValue={search}
          onSearchChange={setSearch}
        />

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
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favoriteIds.has(String(product.id))}
              />
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

      <section className="section-block">
        <SectionHeader title="Browse categories" subtitle="Explore curated products" />
        <div className="category-grid">
          {visibleCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </main>
  );
}
