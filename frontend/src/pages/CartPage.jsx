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
      <section className="hero-section hero-section--solid">
        <p className="eyebrow">Shopping cart</p>
        <h1>Review your selections.</h1>
        <p className="hero-copy">Adjust quantities, remove items, and proceed to checkout with confidence.</p>
      </section>

      <section className="cart-page__content">
        <div className="cart-page__items">
          {cartItems.length === 0 ? (
            <div className="cart-page__empty">
              <h2>Your cart is empty</h2>
              <p>Explore products and add items to start your order.</p>
              <Button to="/products">Continue shopping</Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-page__item" key={item.id}>
                <div className="cart-page__item-image">
                  <div className="cart-page__item-image-placeholder" />
                </div>
                <div className="cart-page__item-details">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="cart-page__item-meta">
                    <span>${item.price.toFixed(2)}</span>
                    <QuantitySelector value={item.quantity} onChange={(quantity) => updateQuantity(item.id, quantity)} />
                  </div>
                </div>
                <div className="cart-page__item-actions">
                  <Button variant="ghost" onClick={() => removeFromCart(item.id)}>Remove</Button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="cart-page__summary">
          <div className="cart-page__summary-header">
            <p className="eyebrow">Order summary</p>
            <h2>Ready to checkout</h2>
          </div>
          <div className="cart-page__summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className="cart-page__summary-row">
            <span>Shipping</span>
            <strong>${shipping.toFixed(2)}</strong>
          </div>
          <div className="cart-page__summary-row cart-page__summary-row--total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <div className="cart-page__summary-actions">
            <Button to="/products" variant="secondary">Continue shopping</Button>
            <Button onClick={() => navigate('/checkout')}>Proceed to checkout</Button>
          </div>
          <Button variant="ghost" onClick={clearCart}>Clear cart</Button>
        </aside>
      </section>
    </main>
  );
}
