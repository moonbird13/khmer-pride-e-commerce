import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button/Button.jsx';
import CategoryCard from '../components/CategoryCard/CategoryCard.jsx';
import Hero from '../components/Hero';
import Newsletter from '../components/Newsletter/Newsletter.jsx';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import ReviewCard from '../components/ReviewCard/ReviewCard.jsx';
import SectionHeader from '../components/SectionHeader';
import ProductFilterBar from '../components/ProductFilterBar/ProductFilterBar.jsx';
import { filterProducts } from '../utils/productFilters.mjs';
import api from '../services/api';
import './HomePage.css';

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

const reviews = [
  { author: 'Sophea', role: 'Verified buyer', comment: 'My order arrived beautifully packaged and the quality exceeded expectations.', rating: 5 },
  { author: 'Rith', role: 'Repeat customer', comment: 'I love supporting local makers and Khmer Pride makes it easy.', rating: 4.8 },
  { author: 'Chan', role: 'New customer', comment: 'The product selection feels curated and stylish.', rating: 4.7 },
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

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
          description: category.description ?? `${category.name ?? category.categoryName} products curated for everyday living.`,
          count: 0,
          image: category.image ?? category.imageUrl ?? null,
        })));

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
        })));
      } catch (error) {
        console.error('Failed to load homepage data.', error);
      }
    };

    loadData();
  }, []);

  const normalizedCategories = useMemo(() => categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: `${category.name} products curated for everyday living.`,
    count: 0,
    image: category.image,
  })), [categories]);

  const featuredProducts = useMemo(() => products.filter((product) => product.isFeatured).slice(0, 4), [products]);
  const bestSellers = useMemo(() => products.filter((product) => product.isBestSeller).slice(0, 3), [products]);
  const newArrivals = useMemo(() => products.filter((product) => product.isNewArrival).slice(0, 3), [products]);

  const visibleCategories = useMemo(() => normalizedCategories.slice(0, 4), [normalizedCategories]);
  const visibleFeatured = useMemo(() => featuredProducts.slice(0, 4), [featuredProducts]);
  const visibleBestSellers = useMemo(() => bestSellers.slice(0, 3), [bestSellers]);
  const visibleNewArrivals = useMemo(() => newArrivals.slice(0, 3), [newArrivals]);

  const { addToCart } = useCart();
  const handleAddToCart = (product, quantity) => addToCart(product, quantity);

  // Product filter state (homepage-only filter bar)
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationValue, setLocationValue] = useState('all');
  const [priceValue, setPriceValue] = useState('all');
  const [brandValue, setBrandValue] = useState('all');
  const [sortValue, setSortValue] = useState('newest');

  const filteredProducts = useMemo(() => (
    filterProducts(products, {
      search,
      selectedCategory,
      location: locationValue,
      priceRange: priceValue,
      brand: brandValue,
      sortBy: sortValue,
    })
  ), [products, search, selectedCategory, locationValue, priceValue, brandValue, sortValue]);

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
        <SectionHeader title="Shop products" subtitle="Filter and discover products" />
        <ProductFilterBar
          products={products}
          categories={normalizedCategories}
          searchValue={search}
          selectedCategory={selectedCategory}
          locationValue={locationValue}
          priceValue={priceValue}
          brandValue={brandValue}
          sortValue={sortValue}
          onSearchChange={(value) => setSearch(value)}
          onCategoryChange={(value) => setSelectedCategory(value)}
          onLocationChange={(value) => setLocationValue(value)}
          onPriceChange={(value) => setPriceValue(value)}
          onBrandChange={(value) => setBrandValue(value)}
          onSortChange={(value) => setSortValue(value)}
          countLabel={`${filteredProducts.length} products`}
        />

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="Browse product collections" subtitle="Explore curated products" />
        <div className="category-grid">
          {visibleCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="Featured products" subtitle="Popular picks" />
        <div className="product-grid">
          {visibleFeatured.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
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
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title="New arrivals" subtitle="Fresh from the market" />
        <div className="product-grid">
          {visibleNewArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
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
