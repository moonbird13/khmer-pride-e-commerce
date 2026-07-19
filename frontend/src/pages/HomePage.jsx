import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/Button/Button.jsx';
import CategoryCard from '../components/CategoryCard/CategoryCard.jsx';
import Newsletter from '../components/Newsletter/Newsletter.jsx';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import SectionHeader from '../components/SectionHeader';
import api, { addFavorite, getFavorites, removeFavorite } from '../services/api';
import './HomePage.css';

const normalizeProducts = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const customerPickReviews = [
  'A favourite for everyday use — great quality, beautifully made, and easy to recommend.',
  'The flavour and freshness are excellent. I would happily buy this again.',
  'Thoughtful Cambodian craftsmanship and a product that makes a lovely gift.',
];

const heroSlides = [
  {
    image: '/angkor-wat-sunset.jpg',
    eyebrow: 'Made in Cambodia',
    title: <>Everyday goods, made <span className="hero-carousel__keep-together">with Khmer pride.</span></>,
    description: '',
    alt: 'Angkor Wat reflected in water at sunset',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [homepageCategories, setHomepageCategories] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([api.get('/categories'), api.get('/products')]);
        const nextProducts = normalizeProducts(productsResponse.data);
        const nextCategories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : categoriesResponse.data?.categories || [];
        setHomepageCategories(nextCategories.map((category) => ({ id: category.id ?? category.categoryId, name: category.name ?? category.categoryName })));

        setProducts(nextProducts.map((product) => ({
          id: product.id ?? product.productId,
          name: product.name ?? product.productName,
          description: product.description ?? product.productDescription,
          price: Number(product.price ?? product.productPrice ?? 0),
          categoryId: product.categoryId ?? product.category?.id,
          category: product.category ?? (product.Category ? { id: product.Category.categoryId, name: product.Category.categoryName } : null),
          isFeatured: Boolean(product.isFeatured),
          isBestSeller: Boolean(product.isBestSeller),
          isNewArrival: Boolean(product.isNewArrival),
          image: product.image ?? product.imageUrl ?? null,
          quantity: Number(product.quantity ?? 0),
        })));
      } catch (error) {
        console.error('Failed to load homepage data.', error);
      }
    };

    loadData();
  }, []);

  const featuredProducts = useMemo(() => products.filter((product) => product.isFeatured).slice(0, 4), [products]);
  const bestSellers = useMemo(() => products.filter((product) => product.isBestSeller).slice(0, 4), [products]);

  const visibleCategories = homepageCategories;
  const visibleFeatured = useMemo(() => featuredProducts.slice(0, 4), [featuredProducts]);
  const visibleBestSellers = useMemo(() => bestSellers.slice(0, 4), [bestSellers]);
  const customerPicks = useMemo(
    () => featuredProducts.slice(0, 3),
    [featuredProducts],
  );

  useEffect(() => {
    const loadCustomerFavorites = async () => {
      if (!user || user.role !== 'customer') {
        setFavoriteIds(new Set());
        return;
      }

      try {
        const favorites = await getFavorites();
        setFavoriteIds(new Set(favorites.map((item) => String(item.id))));
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };

    loadCustomerFavorites();
  }, [user]);

  const { addToCart } = useCart();
  const handleAddToCart = (product, quantity) => addToCart(product, quantity);
  const heroSlide = heroSlides[activeHeroSlide];

  useEffect(() => {
    if (heroSlides.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const selectHeroSlide = (index) => setActiveHeroSlide(index);

  const handleToggleFavorite = async (product) => {
    if (!user || user.role !== 'customer' || !product?.id) return;

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
      console.error('Failed to update favorite:', error);
      setFavoriteIds((current) => {
        const next = new Set(current);
        if (isFavorited) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  };

  return (
    <main className="home-page">
      <section className="hero-carousel" aria-label="Featured collections">
        {heroSlides.map((slide, index) => (
          <article
            className={`hero-carousel__slide${index === activeHeroSlide ? ' hero-carousel__slide--active' : ''}`}
            key={slide.image}
            aria-hidden={index !== activeHeroSlide}
          >
            <img className="hero-carousel__image" src={slide.image} alt={index === activeHeroSlide ? slide.alt : ''} />
            <div className="hero-carousel__overlay" />
            <div className="hero-carousel__content">
              <p className="eyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}</h1>
              <p className="hero-copy">{slide.description}</p>
              <Button to="/products" variant="secondary" className="hero-cta" tabIndex={index === activeHeroSlide ? 0 : -1}>
                Shop the collection
              </Button>
            </div>
          </article>
        ))}

        {heroSlides.length > 1 ? (
          <div className="hero-carousel__dots" aria-label="Choose hero slide">
            {heroSlides.map((slide, index) => (
              <button
                className={`hero-carousel__dot${index === activeHeroSlide ? ' hero-carousel__dot--active' : ''}`}
                type="button"
                key={slide.image}
                onClick={() => selectHeroSlide(index)}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === activeHeroSlide ? 'true' : undefined}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="section-block">
        <SectionHeader
          title="Browse product collections"
          subtitle="Explore curated products"
          action={<Link className="category-view-all" to="/products">View all category <span aria-hidden="true">→</span></Link>}
        />
        <div className="category-grid">
          {visibleCategories.map((category) => (
            <CategoryCard key={category.id} category={category} compact />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="Featured products" subtitle="Popular picks" />
        <div className="product-grid">
          {visibleFeatured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favoriteIds.has(String(product.id))}
              compact
            />
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
          {visibleBestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favoriteIds.has(String(product.id))}
              compact
            />
          ))}
        </div>
      </section>

      <section className="customer-picks" aria-labelledby="customer-picks-title">
        <div className="customer-picks__heading">
          <h2 id="customer-picks-title">Customer Picks</h2>
          <p>Must-have Cambodian products highly rated by our customers.</p>
        </div>
        <div className="customer-picks__grid">
          {customerPicks.map((product, index) => (
            <article className="customer-picks__card" key={product.id}>
              <div className="customer-picks__image">
                {product.image ? <img src={product.image} alt={product.name || 'Product'} /> : <span>Product photo coming soon</span>}
                <span className="customer-picks__stars" aria-label="Five-star customer pick">★★★★★</span>
              </div>
              <div className="customer-picks__review">
                <Link to={`/products/${product.id}`} className="customer-picks__product-name">
                  {product.name}
                </Link>
                <p>{customerPickReviews[index % customerPickReviews.length]}</p>
              </div>
            </article>
          ))}
        </div>
        <Button to="/products" variant="secondary" className="customer-picks__load-more">Load more</Button>
      </section>

      <Newsletter />
    </main>
  );
}
