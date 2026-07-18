import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button.jsx';
import QuantitySelector from '../QuantitySelector/QuantitySelector.jsx';
import Rating from '../Rating/Rating.jsx';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorite = false, className = '' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id, name, description, price, rating, image, category } = product || {};
  const [quantity, setQuantity] = useState(1);
  const categoryName = typeof category === 'object' ? category?.name : category;
  const showFavoriteButton = Boolean(onToggleFavorite) && user?.role === 'customer';

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
    <article className={`ui-card ui-product-card ${className}`.trim()}>
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
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <Rating value={rating || 0} showValue size="sm" readOnly />
      <div className="ui-product-card__footer">
        <strong>${Number(price || 0).toFixed(2)}</strong>
        <div className="ui-product-card__actions">
          <Button to={`/products/${id}`} variant="secondary" size="sm">
            View
          </Button>
          {user ? (
            <Button onClick={() => onAddToCart?.(product, quantity)} size="sm">
              Add
            </Button>
          ) : (
            <Button to="/login" variant="secondary" size="sm">
              Login
            </Button>
          )}
        </div>
      </div>
      <QuantitySelector value={quantity} onChange={setQuantity} />
    </article>
  );
}
