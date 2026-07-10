import Button from './Button';

export default function CartItem({ item, onRemove }) {
  return (
    <li className="cart-item-card">
      <div>
        <h3>Product {item.productId}</h3>
        <p>Quantity: {item.quantity}</p>
      </div>
      {onRemove ? <Button variant="secondary" onClick={() => onRemove(item)}>Remove</Button> : null}
    </li>
  );
}
