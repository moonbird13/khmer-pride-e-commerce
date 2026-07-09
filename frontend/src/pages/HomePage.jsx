import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user, logout, api } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
        ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Catalog load failed', error);
      }
    };

    loadCatalog();
  }, [api]);

  return (
    <div className="page-shell">
      <header className="hero-section">
        <div>
          <p className="eyebrow">Authentic Cambodian goods</p>
          <h1>Khmer Pride brings heritage to your doorstep.</h1>
          <p className="hero-copy">Buy directly from a trusted marketplace that celebrates Cambodian artistry, wellness, and everyday essentials.</p>
          <div className="hero-actions">
            {user ? (
              <>
                <Link className="primary-btn" to="/cart">View cart</Link>
                <Link className="secondary-btn" to="/orders">My orders</Link>
                <button className="secondary-btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="primary-btn" to="/login">Login</Link>
                <Link className="secondary-btn" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="content-section">
        <h2>Categories</h2>
        <div className="product-grid">
          {categories.map((category) => (
            <article key={category.id} className="product-card">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2>Featured products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>${product.price}</strong>
              {user ? (
                <button className="primary-btn" onClick={async () => {
                  await api.post('/cart', { productId: product.id, quantity: 1 });
                  alert(`${product.name} added to cart`);
                }}>Add to cart</button>
              ) : (
                <Link className="secondary-btn" to="/login">Login to buy</Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
