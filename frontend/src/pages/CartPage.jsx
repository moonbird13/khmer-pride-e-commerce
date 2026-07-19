import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector.jsx';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
  const shipping = subtotal > 0 ? 6 : 0;
  const total = subtotal + shipping;

  return (
    <main className="cart-page page-shell">
      <section className="hero-section">
        <p className="eyebrow">Cart</p>
        <h1>Your curated selection</h1>
        <p className="hero-copy">Review your items and continue to checkout when you are ready.</p>
      </section>

      {cartItems.length === 0 ? (
        <section className="cart-page__empty product-card">
          <p>Your cart is empty.</p>
          <Button to="/products">Continue browsing products</Button>
        </section>
      ) : (
        <section className="cart-page__content">
          <article className="cart-page__cart-card">
            <header className="cart-page__cart-header">
              <div>
                <p className="cart-page__label">Your cart</p>
                <h2>{cartItems.length} {cartItems.length === 1 ? 'product' : 'products'} saved</h2>
              </div>
              <div className="cart-page__menu-wrap">
                <button
                  type="button"
                  className="cart-page__more-button"
                  aria-label="Cart options"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <span /> <span /> <span />
                </button>
                {menuOpen ? (
                  <div className="cart-page__menu" role="menu">
                    <Button to="/products" variant="secondary" size="sm" onClick={() => setMenuOpen(false)}>Add more item <span className="cart-page__add-icon">+</span></Button>
                    <button type="button" className="cart-page__delete-cart" onClick={clearCart}>Delete cart</button>
                  </div>
                ) : null}
              </div>
            </header>

            <div className="cart-page__products">
              {cartItems.map((item) => (
                <div className="cart-page__product-row" key={item.id}>
                  <div className="cart-page__product-image">
                    {item.image && !item.image.includes('ðŸ') ? <img src={item.image} alt={item.name} /> : <span>Product photo coming soon</span>}
                  </div>
                  <div className="cart-page__product-info">
                    <h3>{item.name}</h3>
                    <p>${item.price.toFixed(2)} each</p>
                    <QuantitySelector value={item.quantity} onChange={(quantity) => updateQuantity(item.id, quantity)} />
                  </div>
                  <strong className="cart-page__product-total">${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <Button className="cart-page__view-cart" variant="secondary" onClick={() => navigate('/checkout')}>View more</Button>
          </article>

          <aside className="cart-page__summary">
            <h2>Order summary</h2>
            <div className="cart-page__summary-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div className="cart-page__summary-row"><span>Shipping</span><strong>${shipping.toFixed(2)}</strong></div>
            <div className="cart-page__summary-row cart-page__summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
            <Button onClick={() => navigate('/checkout')}>Checkout</Button>
          </aside>
        </section>
      )}
    </main>
  );
}
