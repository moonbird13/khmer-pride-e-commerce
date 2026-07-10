import { Link } from 'react-router-dom';
import Button from './Button';

export default function ProductCard({ product, user, onAddToCart }) {
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <strong>${product.price}</strong>
      <div className="card-actions">
        <Button to={`/products/${product.id}`} variant="secondary">View details</Button>
        {user ? (
          <Button onClick={() => onAddToCart(product)}>Add to cart</Button>
        ) : (
          <Button to="/login" variant="secondary">Login to buy</Button>
        )}
      </div>
    </article>
  );
}
