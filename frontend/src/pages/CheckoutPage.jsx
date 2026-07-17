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
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const navigate = useNavigate();

  const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [orderItems]);
  const shipping = orderItems.length > 0 ? 6 : 0;
  const total = subtotal + shipping;

  const handleSubmit = (event) => {
    event.preventDefault();
    placeOrder({ fullName, email, address, city, paymentMethod });
    navigate('/order-success');
  };

  return (
    <main className="checkout-page page-shell">
      <section className="hero-section hero-section--solid">
        <p className="eyebrow">Checkout</p>
        <h1>Complete your order</h1>
        <p className="hero-copy">Review shipping information, choose a payment method, and place your order securely.</p>
      </section>

      <div className="checkout-page__content">
        <form className="checkout-page__section checkout-page__form" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">Shipping information</p>
            <h2>Delivery details</h2>
          </div>

          <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" required />
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          <Input label="Address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street address" required />
          <Input label="City" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Phnom Penh" required />

          <div className="checkout-page__payment-panel">
            <p className="eyebrow">Payment method</p>
            <label className="checkout-page__payment-option">
              <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(event) => setPaymentMethod(event.target.value)} />
              <span>Cash on delivery</span>
            </label>
          </div>

          <Button type="submit">Place order</Button>
        </form>

        <aside className="checkout-page__summary checkout-page__summary--tall">
          <div className="checkout-page__summary-header">
            <p className="eyebrow">Order summary</p>
            <h2>Order total</h2>
          </div>

          <div className="checkout-page__summary-list">
            {orderItems.map((item) => (
              <div className="checkout-page__summary-row" key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-page__summary-row">
            <span>Shipping</span>
            <strong>${shipping.toFixed(2)}</strong>
          </div>

          <div className="checkout-page__summary-row checkout-page__summary-row--total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <Button to="/cart" variant="secondary">Back to cart</Button>
        </aside>
      </div>
    </main>
  );
}
