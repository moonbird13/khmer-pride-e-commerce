import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import CartItem from '../components/CartItem';
import Hero from '../components/Hero';
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
      <Hero
        eyebrow="Cart"
        title="Your cart"
        description="Review your selections and complete your Khmer Pride order."
      />
      {message ? <div className="error-box">{message}</div> : null}
      {cart.items.length === 0 ? (
        <div className="product-card">
          <p>Your cart is empty.</p>
          <Button to="/">Continue shopping</Button>
        </div>
      ) : (
        <div className="product-card">
          <ul className="summary-list">
            {cart.items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </ul>
          <div className="checkout-total">
            <span>Total</span>
            <strong>${cart.items.reduce((sum, item) => sum + item.quantity * 20, 0).toFixed(2)}</strong>
          </div>
          <div className="card-actions">
            <Button onClick={handleCheckout} disabled={loading}>
              {loading ? 'Placing order...' : 'Checkout'}
            </Button>
            <Button to="/" variant="secondary">Continue shopping</Button>
          </div>
        </div>
      )}
    </div>
  );
}
