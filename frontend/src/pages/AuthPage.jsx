import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mode = location.pathname.includes('register') ? 'register' : 'login';

  const handleSubmit = async ({ fullName, email, password }) => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'register') {
        await register(fullName, email, password);
        navigate('/login');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthForm mode={mode} onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
}
