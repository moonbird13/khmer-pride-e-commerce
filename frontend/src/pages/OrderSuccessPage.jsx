import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/orders'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="page-shell" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <p className="eyebrow">Order confirmed</p>
      <h1>Your order has been placed.</h1>
      <p style={{ marginBottom: '2rem' }}>Thank you for shopping with Khmer Pride. You will receive a confirmation email shortly. Redirecting to your orders in 5 seconds...</p>
      <Button to="/orders">View orders</Button>
    </main>
  );
}
