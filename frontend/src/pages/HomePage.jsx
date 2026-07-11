import Button from '../components/Button/Button.jsx';
import CategoryCard from '../components/CategoryCard/CategoryCard.jsx';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter/Newsletter.jsx';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import ReviewCard from '../components/ReviewCard/ReviewCard.jsx';
import SectionHeader from '../components/SectionHeader';
import './HomePage.css';

const categories = [
  { id: 'fashion', name: 'Fashion', description: 'Silk bags, apparel, and accessories.', count: 24, image: '👜' },
  { id: 'home', name: 'Home', description: 'Decor and kitchen essentials for every room.', count: 18, image: '🏺' },
  { id: 'wellness', name: 'Wellness', description: 'Herbal care and self-care goods for daily calm.', count: 12, image: '🌿' },
  { id: 'gifts', name: 'Gifts', description: 'Handcrafted gifts with authentic Cambodian charm.', count: 16, image: '🎁' },
];

const featuredProducts = [
  { id: 1, name: 'Silk Tote', description: 'Hand-woven and designed for modern carry.', price: 42, rating: 4.8, category: 'Fashion', image: '👜' },
  { id: 2, name: 'Ceramic Set', description: 'Elegant tableware for everyday rituals.', price: 36, rating: 4.6, category: 'Home', image: '🍶' },
  { id: 3, name: 'Herbal Blend', description: 'A soothing cup crafted from local herbs.', price: 19, rating: 4.9, category: 'Wellness', image: '🌿' },
  { id: 4, name: 'Silk Scarf', description: 'Lightweight texture and timeless finish.', price: 29, rating: 4.7, category: 'Fashion', image: '🧣' },
];

const bestSellers = [
  { id: 5, name: 'Lotus Candle', description: 'Soft fragrance from hand-poured soy wax.', price: 22, rating: 4.9, category: 'Home', image: '🕯️' },
  { id: 6, name: 'Tea Collection', description: 'Herbal blends made for evening calm.', price: 24, rating: 4.8, category: 'Wellness', image: '🍵' },
  { id: 7, name: 'Canvas Backpack', description: 'Durable and polished for everyday use.', price: 54, rating: 4.7, category: 'Fashion', image: '🎒' },
];

const newArrivals = [
  { id: 8, name: 'Ceramic Planter', description: 'Artful storage for houseplants and herbs.', price: 32, rating: 4.6, category: 'Home', image: '🪴' },
  { id: 9, name: 'Spa Gift Set', description: 'Relaxing care essentials for home rituals.', price: 48, rating: 4.9, category: 'Wellness', image: '🛀' },
  { id: 10, name: 'Woven Tray', description: 'A natural accent for living spaces.', price: 27, rating: 4.5, category: 'Home', image: '🧺' },
];

const reviews = [
  { author: 'Sophea', role: 'Verified buyer', comment: 'My order arrived beautifully packaged and the quality exceeded expectations.', rating: 5 },
  { author: 'Rith', role: 'Repeat customer', comment: 'I love supporting local makers and Khmer Pride makes it easy.', rating: 4.8 },
  { author: 'Chan', role: 'New customer', comment: 'The product selection feels curated and stylish.', rating: 4.7 },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <Hero
        eyebrow="Authentic Cambodian living"
        title="Everyday goods, made with Khmer pride."
        description="Browse curated product collections, discover featured products, and support local makers with every purchase."
        actions={(
          <div className="hero-actions">
            <Button to="/products">Explore now</Button>
            <Button to="/register" variant="secondary">Create account</Button>
          </div>
        )}
      >
        <div className="hero-badge">Free shipping on orders over $60</div>
      </Hero>

      <section className="section-block">
        <SectionHeader title="Browse product collections" subtitle="Explore curated products" />
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="Featured products" subtitle="Popular picks" />
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="promotion-banner">
        <div>
          <p className="eyebrow">Limited time offer</p>
          <h2>Take 20% off your first handcrafted order.</h2>
          <p>Enjoy exclusive savings on thoughtfully made products from Cambodia.</p>
        </div>
        <Button to="/products" variant="primary">Browse collection</Button>
      </section>

      <section className="section-block">
        <SectionHeader title="Best sellers" subtitle="Top-rated favourites" />
        <div className="product-grid">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="New arrivals" subtitle="Fresh from the market" />
        <div className="product-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="Customer reviews" subtitle="Hear from buyers" />
        <div className="review-grid">
          {reviews.map((review) => (
            <ReviewCard key={review.author} review={review} />
          ))}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
