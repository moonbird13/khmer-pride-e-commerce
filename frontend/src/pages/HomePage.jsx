import { useEffect, useState } from 'react';
import Button from '../components/Button';
import CategoryCard from '../components/CategoryCard';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ReviewCard from '../components/ReviewCard';
import SearchBar from '../components/SearchBar';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user, logout, api } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
        ]);
        setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : productsResponse.data.products || []);
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : categoriesResponse.data.categories || []);
      } catch (error) {
        console.error('Catalog load failed', error);
      }
    };

    loadCatalog();
  }, [api]);

  const handleAddToCart = async (product) => {
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 });
      alert(`${product.name} added to cart`);
    } catch (error) {
      console.error('Add to cart failed', error);
    }
  };

  const visibleProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    return !search || product.name?.toLowerCase().includes(search) || product.description?.toLowerCase().includes(search);
  });

  const bestSellers = visibleProducts.slice(0, 3);
  const newArrivals = visibleProducts.slice(-3);
  const reviews = [
    { id: 1, author: 'Sokha', role: 'Customer', comment: 'The packaging felt premium and the product quality was excellent.' },
    { id: 2, author: 'Mina', role: 'Founder', comment: 'Khmer Pride makes it easy to support local craftsmanship.' },
  ];

  const heroActions = user ? (
    <>
      <Button to="/cart">View cart</Button>
      <Button to="/orders" variant="secondary">My orders</Button>
      <Button variant="secondary" onClick={logout}>Logout</Button>
    </>
  ) : (
    <>
      <Button to="/login">Login</Button>
      <Button to="/register" variant="secondary">Register</Button>
    </>
  );

  return (
    <div className="page-shell">
      <Hero
        eyebrow="Authentic Cambodian goods"
        title="Khmer Pride brings heritage to your doorstep."
        description="Buy directly from a trusted marketplace that celebrates Cambodian artistry, wellness, and everyday essentials."
        actions={heroActions}
      />

      <section className="content-section">
        <SectionHeader title="Shop by category" subtitle="Curated collections" />
        <div className="product-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeader title="Featured products" subtitle="Popular right now" action={<SearchBar value={searchTerm} onChange={setSearchTerm} />} />
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} user={user} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      <section className="content-section promo-banner">
        <div>
          <p className="eyebrow">Limited offer</p>
          <h3>Enjoy free shipping on orders over $50.</h3>
          <p>Celebrate Cambodian craftsmanship with exclusive bundles and fast delivery.</p>
        </div>
        <Button to="/products">Shop now</Button>
      </section>

      <section className="content-section">
        <SectionHeader title="Best sellers" subtitle="Most loved" />
        <div className="product-grid">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} user={user} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeader title="New arrivals" subtitle="Fresh picks" />
        <div className="product-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} user={user} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeader title="What our customers say" subtitle="Community reviews" />
        <div className="product-grid">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="content-section newsletter-card">
        <div>
          <p className="eyebrow">Stay updated</p>
          <h3>Join our newsletter for launches and exclusive offers.</h3>
        </div>
        <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setEmail(''); alert('Thanks for subscribing!'); }}>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" required />
          <Button type="submit">Subscribe</Button>
        </form>
      </section>
    </div>
  );
}
