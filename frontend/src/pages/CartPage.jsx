import { useMemo, useState } from 'react';
import Button from '../components/Button/Button.jsx';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector.jsx';
import { products } from '../data/mockData';
import './CartPage.css';

const initialCart = [
  { id: products[0].id, name: products[0].name, price: products[0].price, quantity: 1, description: products[0].description },
  { id: products[2].id, name: products[2].name, price: products[2].price, quantity: 2, description: products[2].description },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
  const shipping = subtotal > 0 ? 6 : 0;
  const total = subtotal + shipping;

  const updateQuantity = (id, quantity) => {
    setCartItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

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
                  <Button variant="secondary" onClick={() => removeItem(item.id)}>Remove</Button>
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
          <Button to="/checkout">Checkout</Button>
        </aside>
      </section>
    </main>
  );
}
