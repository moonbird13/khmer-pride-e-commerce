import { useState } from 'react';
import Button from './Button';
import QuantitySelector from './QuantitySelector';
import Rating from './Rating';

export default function ProductCard({ product, user, onAddToCart, className = '' }) {
  const { id, name, description, price, rating, image, category } = product || {};
  const [quantity, setQuantity] = useState(1);

  return (
    <article className={`ui-card ui-product-card ${className}`.trim()}>
      <div className="ui-product-card__image">{image || category || 'Featured'}</div>
      <div>
        <p className="ui-card__meta">{category || 'Featured product'}</p>
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
