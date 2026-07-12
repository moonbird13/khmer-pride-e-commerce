import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems: orderItems, placeOrder } = useCart();
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [orderItems]);
  const shipping = 6;
  const total = subtotal + shipping;

  const handleSubmit = (event) => {
    event.preventDefault();
    placeOrder({ fullName, email, address, city, paymentMethod });
    navigate('/order-success');
  };

  return (
    <main className="checkout-page page-shell">
      <section className="hero-section">
        <p className="eyebrow">Checkout</p>
        <h1>Complete your order</h1>
        <p className="hero-copy">Review the shipping details and choose a payment method to finish your purchase.</p>
      </section>

      <div className="checkout-page__content">
        <form className="checkout-page__section" onSubmit={handleSubmit}>
          <h2>Shipping details</h2>
          <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" required />
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          <Input label="Address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street address" required />
          <Input label="City" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Phnom Penh" required />

          <h3>Payment method</h3>
          <div className="checkout-page__payment-options">
            <label className="checkout-page__payment-option">
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(event) => setPaymentMethod(event.target.value)} />
              <span>Credit or debit card</span>
            </label>
            <label className="checkout-page__payment-option">
              <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(event) => setPaymentMethod(event.target.value)} />
              <span>Cash on delivery</span>
            </label>
          </div>

          {message ? <div className="auth-panel__status">{message}</div> : null}
          <Button type="submit">Place order</Button>
        </form>

        <aside className="checkout-page__summary">
          <h2>Order summary</h2>
          {orderItems.map((item) => (
            <div className="checkout-page__summary-row" key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <strong>${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
          <div className="checkout-page__summary-row">
            <span>Shipping</span>
            <strong>${shipping.toFixed(2)}</strong>
          </div>
          <div className="checkout-page__summary-row">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <Button to="/cart" variant="secondary">Back to cart</Button>
        </aside>
      </div>
    </main>
  );
}
