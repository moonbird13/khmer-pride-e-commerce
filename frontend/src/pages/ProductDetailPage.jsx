import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector.jsx';
import { addFavorite, getFavorites, removeFavorite } from '../services/api';
import api from '../services/api';
import './ProductDetailPage.css';

const normalizeProducts = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setProduct(null);
        setRelatedProducts([]);
        return;
      }

      try {
        const [productResponse, productsResponse] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/products'),
        ]);

        const nextProduct = productResponse.data;
        const nextProducts = normalizeProducts(productsResponse.data);

        setProduct({
          id: nextProduct?.id ?? nextProduct?.productId,
          name: nextProduct?.name ?? nextProduct?.productName,
          description: nextProduct?.description ?? nextProduct?.productDescription,
          price: Number(nextProduct?.price ?? nextProduct?.productPrice ?? 0),
          category: nextProduct?.category ?? (nextProduct?.Category ? { id: nextProduct.Category.categoryId, name: nextProduct.Category.categoryName } : null),
          isFeatured: Boolean(nextProduct?.isFeatured),
          isBestSeller: Boolean(nextProduct?.isBestSeller),
          isNewArrival: Boolean(nextProduct?.isNewArrival),
          image: nextProduct?.image ?? nextProduct?.imageUrl ?? null,
          quantity: Number(nextProduct?.quantity ?? 0),
        });

        setRelatedProducts(nextProducts
          .map((item) => ({
            id: item.id ?? item.productId,
            name: item.name ?? item.productName,
            description: item.description ?? item.productDescription,
            price: Number(item.price ?? item.productPrice ?? 0),
            category: item.category ?? (item.Category ? { id: item.Category.categoryId, name: item.Category.categoryName } : null),
            isFeatured: Boolean(item.isFeatured),
            isBestSeller: Boolean(item.isBestSeller),
            isNewArrival: Boolean(item.isNewArrival),
            image: item.image ?? item.imageUrl ?? null,
            quantity: Number(item.quantity ?? 0),
          }))
          .filter((item) => String(item.id) !== String(nextProduct?.id ?? nextProduct?.productId))
          .slice(0, 2));
      } catch (error) {
        console.error('Failed to load product details.', error);
        setProduct(null);
        setRelatedProducts([]);
      }
    };

    loadProduct();
  }, [id]);

  const loadReviews = async () => {
    try { const { data } = await api.get(`/reviews/product/${id}`); setReviews(data); } catch { setReviews([]); }
  };
  useEffect(() => { if (id) loadReviews(); }, [id]);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());

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

  const handleAddToCart = () => addToCart(product, quantity);
  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/reviews/product/${id}`, { rating: Number(reviewRating), comments: reviewComment });
      setReviewComment(''); setReviewError(''); loadReviews();
    } catch (error) { setReviewError(error?.response?.data?.message || 'Unable to submit review.'); }
  };

  const handleToggleFavorite = async (productToToggle) => {
    if (!user || user.role !== 'customer' || !productToToggle?.id) return;

    const productId = String(productToToggle.id);
    const isFavorited = favoriteIds.has(productId);

    try {
      if (isFavorited) {
        await removeFavorite(productToToggle.id);
        setFavoriteIds((current) => {
          const next = new Set(current);
          next.delete(productId);
          return next;
        });
      } else {
        await addFavorite(productToToggle.id);
        setFavoriteIds((current) => {
          const next = new Set(current);
          next.add(productId);
          return next;
        });
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
      window.alert(error?.response?.data?.message || 'Unable to save this favorite. Please log in again and retry.');
    }
  };

  const isCurrentProductFavorite = product && favoriteIds.has(String(product.id));
  const productDetails = String(product?.description || '').split('\n').map((line) => {
    const [label, ...value] = line.split(':');
    return { label: value.length ? label : 'About', value: value.length ? value.join(':').trim() : line };
  });

  if (!product) {
    return <main className="product-detail-page page-shell"><p>Loading product...</p></main>;
  }

  return (
    <main className="product-detail-page page-shell">
      <nav className="product-detail-page__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <section className="product-detail-page__layout">
        <div className="product-detail-page__gallery">
          <div className="product-detail-page__gallery-main">
            {product.image ? (
              <img src={product.image} alt={product.name || 'Product image'} />
            ) : (
              product.category?.name || 'Product'
            )}
          </div>
          <div className="product-detail-page__gallery-thumbs" role="list">
            <button type="button" className="product-detail-page__gallery-thumb is-active">{product.name}</button>
          </div>
        </div>

        <div className="product-detail-page__info">
          <p className="eyebrow">{product.category?.name || 'Featured'}</p>
          <h1>{product.name}</h1>
          <div className="product-detail-page__details-card">{productDetails.map((detail) => <div key={detail.label}><strong>{detail.label}</strong><span>{detail.value}</span></div>)}</div>
          <div className="product-detail-page__price">${Number(product.price).toFixed(2)}</div>
          <p className="product-detail-page__meta">Featured: {product.isFeatured ? 'Yes' : 'No'}</p>

          <div className="product-detail-page__actions">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <Button onClick={handleAddToCart} disabled={Number(product.quantity) <= 0}>{Number(product.quantity) <= 0 ? 'Out of stock' : 'Add to cart'}</Button>
            {user?.role === 'customer' ? (
              <button
                type="button"
                className={`product-detail-page__favorite ${isCurrentProductFavorite ? 'active' : ''}`}
                onClick={() => handleToggleFavorite(product)}
                aria-label={isCurrentProductFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
              </button>
            ) : null}
            <Button to="/checkout" variant="secondary">Checkout</Button>
          </div>

        </div>
      </section>

      <section className="product-detail-page__section">
        <h2>Customer reviews</h2>
        <div className="product-reviews">{reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((review) => <article key={review.id}><strong>{review.customerName}</strong><span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span><p>{review.comments}</p><small>{new Date(review.createdAt).toLocaleDateString()}</small></article>)}</div>
        {user?.role === 'customer' ? <form className="review-form" onSubmit={handleReviewSubmit}><h3>Write a review</h3><label>Rating<select value={reviewRating} onChange={(event) => setReviewRating(event.target.value)}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating > 1 ? 's' : ''}</option>)}</select></label><label>Your review<textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} required rows="3" /></label>{reviewError && <p className="review-error">{reviewError}</p>}<Button type="submit">Submit review</Button></form> : <p>Sign in with a customer account to leave a rating and review.</p>}
      </section>

      <section className="product-detail-page__section">
        <h2>Related products</h2>
        <div className="product-grid">
          {relatedProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favoriteIds.has(String(item.id))}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
