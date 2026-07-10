import { useEffect, useState } from 'react';
import Button from '../components/Button';
import CategoryCard from '../components/CategoryCard';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../contexts/AuthContext';

export default function ProductsPage() {
  const { api, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
        ]);
        setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : productsResponse.data.products || []);
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : categoriesResponse.data.categories || []);
      } catch (error) {
        console.error('Catalog load failed', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, [api]);

  const categoryFilteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product) => {
        const categoryId = product.categoryId ?? product.category?.id;
        const categoryName = product.categoryName ?? product.category?.name ?? product.category;
        return String(categoryId) === String(selectedCategory) || String(categoryName) === String(selectedCategory);
      });

  const visibleProducts = categoryFilteredProducts.filter((product) => {
    const search = searchTerm.toLowerCase();
    return !search || product.name?.toLowerCase().includes(search) || product.description?.toLowerCase().includes(search);
  });

  const handleAddToCart = async (product) => {
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 });
      alert(`${product.name} added to cart`);
    } catch (error) {
      console.error('Add to cart failed', error);
    }
  };

  return (
    <div className="page-shell">
      <Hero
        eyebrow="Shop"
        title="Discover meaningful goods"
        description="Browse the full Khmer Pride collection and choose the pieces that fit your lifestyle."
        actions={(
          <div className="hero-actions">
            <Button to="/" variant="secondary">Back home</Button>
            {user ? <Button to="/cart">Open cart</Button> : <Button to="/login">Login to shop</Button>}
          </div>
        )}
      />

      <section className="content-section">
        <h2>Categories</h2>
        <div className="chip-row">
          <button className={`chip ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>All products</button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`chip ${selectedCategory === String(category.id) ? 'active' : ''}`}
              onClick={() => setSelectedCategory(String(category.id))}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="page-header">
          <h2>Products</h2>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} user={user} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
