import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const featuredProducts = [
  { name: 'Khmer Silk Scarf', price: '$24', description: 'Handwoven silk scarf inspired by Cambodian heritage.' },
  { name: 'Bamboo Toothbrush Set', price: '$12', description: 'Eco-friendly bamboo toothbrushes crafted in Cambodia.' },
  { name: 'Palm Sugar Syrup', price: '$18', description: 'Naturally sourced palm sugar syrup from local farms.' },
];

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="page-shell">
      <header className="hero-section">
        <div>
          <p className="eyebrow">Authentic Cambodian goods</p>
          <h1>Khmer Pride brings heritage to your doorstep.</h1>
          <p className="hero-copy">Buy directly from a trusted marketplace that celebrates Cambodian artistry, wellness, and everyday essentials.</p>
          <div className="hero-actions">
            {user ? (
              <button className="primary-btn" onClick={logout}>Logout</button>
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
        <h2>Featured products</h2>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article key={product.name} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>{product.price}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
