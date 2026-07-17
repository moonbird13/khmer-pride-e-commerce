import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button.jsx';
import Rating from '../Rating/Rating.jsx';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart, className = '' }) {
  const { user } = useAuth();
  const { id, name, description, price, rating, category } = product || {};
  const [quantity, setQuantity] = useState(1);

  return (
    <article className={`ui-product-card ${className}`.trim()}>
      <div className="ui-product-card__image">
        {product?.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="ui-product-card__image-media"
          />
        ) : (
          <div className="ui-product-card__image-placeholder" />
        )}
        {product?.badge ? (
          <span className="ui-product-card__badge">{product.badge}</span>
        ) : null}
        <button
          type="button"
          className="ui-product-card__wishlist"
          aria-label="Add to wishlist"
        >
          ❤
        </button>
      </div>

      <div className="ui-product-card__content">
        <div>
          <p className="ui-product-card__meta">{category || 'Featured'}</p>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>

        <div className="ui-product-card__footer">
          <div className="ui-product-card__rating">
            <Rating value={rating || 0} showValue size="sm" readOnly />
            <span>({rating || 0})</span>
          </div>
          <div className="ui-product-card__price">${Number(price || 0).toFixed(2)}</div>
        </div>
      </div>

      <div className="ui-product-card__actions">
        <Button to={`/products/${id}`} variant="secondary" size="sm">
          View
        </Button>
        {user ? (
          <Button onClick={() => onAddToCart?.(product, quantity)} size="sm">
            Add to Cart
          </Button>
        ) : (
          <Button to="/login" variant="secondary" size="sm">
            Login to Buy
          </Button>
        )}
      </div>
    </article>
  );
}
