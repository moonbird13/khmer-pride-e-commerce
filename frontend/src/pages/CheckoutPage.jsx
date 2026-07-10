import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { api, user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await api.get('/cart');
        setCart(response.data);
      } catch (error) {
        console.error('Checkout load failed', error);
      }
    };

    loadCart();
  }, [api]);

  const total = cart.items.reduce((sum, item) => sum + item.quantity * (item.price || 20), 0);

  const handleCheckout = async () => {
    if (!user) {
      setMessage('Please login before placing an order.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/orders', {
        userId: user.id,
        items: cart.items,
        total,
      });
      setMessage(`Order placed successfully! Order #${response.data.id}`);
      await api.delete('/cart');
      navigate('/orders');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Complete your order</h1>
          <p className="hero-copy">Review your selected items and finalize your Khmer Pride purchase.</p>
        </div>
        <div className="page-actions">
          <Link className="secondary-btn" to="/cart">Back to cart</Link>
          <Link className="primary-btn" to="/">Continue shopping</Link>
        </div>
      </div>

      <section className="product-card">
        {message ? <div className="error-box">{message}</div> : null}
        {cart.items.length === 0 ? (
          <div>
            <p>Your cart is empty.</p>
            <Link className="primary-btn" to="/products">Browse products</Link>
          </div>
        ) : (
          <>
            <ul className="summary-list">
              {cart.items.map((item) => (
                <li key={item.productId}>
                  <span>Product {item.productId}</span>
                  <strong>Qty {item.quantity}</strong>
                </li>
              ))}
            </ul>
            <div className="checkout-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button className="primary-btn" onClick={handleCheckout} disabled={loading}>
              {loading ? 'Placing order...' : 'Place order'}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
