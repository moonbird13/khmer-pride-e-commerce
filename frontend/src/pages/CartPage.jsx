import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CartPage() {
  const { api, user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to load cart', error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [api]);

  const handleCheckout = async () => {
    if (!user) {
      setMessage('Please login to place an order.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/orders', {
        userId: user.id,
        items: cart.items,
        total: cart.items.reduce((sum, item) => sum + item.quantity * 20, 0),
      });
      setMessage(`Order placed successfully! Order #${response.data.id}`);
      await api.delete('/cart');
      await loadCart();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <h1>Your cart</h1>
      <p>Review your selections and complete your Khmer Pride order.</p>
      {message ? <div className="error-box">{message}</div> : null}
      {cart.items.length === 0 ? (
        <div className="product-card">
          <p>Your cart is empty.</p>
          <Link className="primary-btn" to="/">Continue shopping</Link>
        </div>
      ) : (
        <div className="product-card">
          <ul>
            {cart.items.map((item) => (
              <li key={item.productId}>
                Product {item.productId} × {item.quantity}
              </li>
            ))}
          </ul>
          <button className="primary-btn" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Placing order...' : 'Checkout'}
          </button>
        </div>
      )}
    </div>
  );
}
