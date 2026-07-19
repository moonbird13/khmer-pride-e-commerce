import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button.jsx';
import QuantitySelector from '../QuantitySelector/QuantitySelector.jsx';
import Rating from '../Rating/Rating.jsx';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorite = false, compact = false, className = '' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id, name, description, price, rating, image, category } = product || {};
  const [quantity, setQuantity] = useState(1);
  const categoryName = typeof category === 'object' ? category?.name : category;
  const showFavoriteButton = Boolean(onToggleFavorite) && user?.role === 'customer';
  const isOutOfStock = product?.quantity != null && Number(product.quantity) <= 0;

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    onToggleFavorite?.(product);
  };

  return (
    <article className={`ui-card ui-product-card${compact ? ' ui-product-card--compact' : ''} ${className}`.trim()}>
      <div className="ui-product-card__image">
        {image ? (
          <img src={image} alt={name || 'Product image'} />
        ) : (
          categoryName || 'Featured'
        )}
        {showFavoriteButton ? (
          <button
            type="button"
            className={`ui-product-card__favorite ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
          </button>
        ) : null}
      </div>
      <div className="ui-product-card__content">
        <p className="ui-card__meta">{categoryName || 'Featured product'}</p>
        <h3><Link to={`/products/${id}`}>{name}</Link></h3>
        {isOutOfStock ? <p className="ui-product-card__stock">Out of stock</p> : null}
        {!compact ? <p>{description}</p> : null}
      </div>
      {!compact ? <Rating value={rating || 0} showValue size="sm" readOnly /> : null}
      <div className="ui-product-card__footer">
        <strong>${Number(price || 0).toFixed(2)}</strong>
        <div className="ui-product-card__actions">
          <Button to={`/products/${id}`} variant="secondary" size="sm">
            View
          </Button>
          {user ? (
            <Button onClick={() => onAddToCart?.(product, quantity)} size="sm" disabled={isOutOfStock}>
              {isOutOfStock ? 'Out of stock' : 'Add'}
            </Button>
          ) : (
            <Button to="/login" variant="secondary" size="sm">
              Login
            </Button>
          )}
        </div>
      </div>
      {!compact ? <QuantitySelector value={quantity} onChange={setQuantity} /> : null}
    </article>
  );
}
