import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector.jsx';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
  const shipping = subtotal > 0 ? 6 : 0;
  const total = subtotal + shipping;

  return (
    <main className="cart-page page-shell">
      <section className="hero-section">
        <p className="eyebrow">Cart</p>
        <h1>Your curated selection</h1>
        <p className="hero-copy">Adjust quantities, remove items, and continue to checkout when you are ready.</p>
      </section>

      <section className="cart-page__content">
        <div className="cart-page__items">
          {cartItems.length === 0 ? (
            <div className="product-card">
              <p>Your cart is empty.</p>
              <Button to="/products">Continue browsing products</Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-page__item" key={item.id}>
                <div className="cart-page__item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>${item.price.toFixed(2)}</strong>
                </div>
                <div className="cart-page__item-actions">
                  <QuantitySelector value={item.quantity} onChange={(quantity) => updateQuantity(item.id, quantity)} />
                  <Button variant="secondary" onClick={() => removeFromCart(item.id)}>Remove</Button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="cart-page__summary">
          <h2>Order summary</h2>
          <div className="cart-page__summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className="cart-page__summary-row">
            <span>Shipping</span>
            <strong>${shipping.toFixed(2)}</strong>
          </div>
          <div className="cart-page__summary-row">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <Button to="/products" variant="secondary">Continue browsing products</Button>
          <Button onClick={clearCart} variant="secondary">Clear cart</Button>
          <Button onClick={() => navigate('/checkout')}>Checkout</Button>
        </aside>
      </section>
    </main>
  );
}
