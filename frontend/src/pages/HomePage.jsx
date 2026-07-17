import { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button/Button.jsx';
import CategoryCard from '../components/CategoryCard/CategoryCard.jsx';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import { categories as mockCategories } from '../data/categories';
import { products as mockProducts } from '../data/products';
import './HomePage.css';

export default function HomePage() {
  const [categories] = useState(mockCategories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description || category.name,
    image: category.image,
  })));
  const [featuredProducts] = useState(mockProducts.filter((product) => product.isFeatured).slice(0, 4));

  const visibleCategories = useMemo(() => categories.slice(0, 5), [categories]);
  const visibleFeatured = useMemo(() => featuredProducts.slice(0, 4), [featuredProducts]);
  const heroProduct = visibleFeatured[0];

  const { addToCart } = useCart();
  const handleAddToCart = (product, quantity) => addToCart(product, quantity);

  return (
    <main className="home-page">
      <Hero
        eyebrow="Made in Cambodia"
        title="Everyday goods, made with Khmer pride."
        description="Discover handcrafted local products, food, and home essentials made by Khmer artisans."
        actions={(
          <div className="hero-actions">
            <Button to="/products" variant="primary" size="lg">Shop the collection</Button>
          </div>
        )}
      >
        <div className="home-hero-panel">
          <div className="home-hero-card">
            <img src={heroProduct?.image} alt={heroProduct?.name} className="home-hero-card__image" />
            <div className="home-hero-card__content">
              <span className="home-hero-card__tag">Featured product</span>
              <h3>{heroProduct?.name}</h3>
              <p>{heroProduct?.description}</p>
              <div className="home-hero-card__actions">
                <Button to={`/products/${heroProduct?.id}`} variant="secondary">View product</Button>
                <Button onClick={() => heroProduct && handleAddToCart(heroProduct, 1)} variant="ghost">Add to cart</Button>
              </div>
            </div>
          </div>

          <div className="home-hero-stats">
            <div className="home-hero-stat">
              <strong>{visibleFeatured.length}+</strong>
              <span>Premium local favorites</span>
            </div>
            <div className="home-hero-stat">
              <strong>{visibleCategories.length}</strong>
              <span>Handpicked categories</span>
            </div>
          </div>
        </div>
      </Hero>

      <section className="section-block">
        <div className="section-header section-header--split">
          <div>
            <p className="eyebrow">Featured products</p>
            <h2>Curated picks for you</h2>
          </div>
          <Button to="/products" variant="secondary" size="sm">View all</Button>
        </div>
        <div className="product-grid">
          {visibleFeatured.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      <section className="section-block section-block--alt">
        <div className="section-header section-header--split">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2>Explore every collection</h2>
          </div>
        </div>
        <div className="category-grid">
          {visibleCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </main>
  );
}
