import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import './AuthPage.css';

export default function AuthPage() {
  const location = useLocation();
  const pathname = location.pathname;
  const mode = pathname === '/register' ? 'register' : pathname === '/forgot-password' ? 'forgot' : pathname.startsWith('/reset-password') ? 'reset' : pathname.startsWith('/verify-email') ? 'verify' : 'login';

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuthSubmit = ({ email: authEmail, password: authPassword, fullName }) => {
    setMessage(`Prepared ${mode === 'register' ? 'registration' : 'login'} for ${authEmail}. No backend call has been made.`);
    console.info('Auth form placeholder', { fullName, authEmail, authPassword });
  };

  const handleForgotSubmit = (event) => {
    event.preventDefault();
    setMessage(`Recovery instructions prepared for ${email}.`);
  };

  const handleResetSubmit = (event) => {
    event.preventDefault();
    setMessage(`Password reset prepared for ${email}.`);
  };

  return (
    <main className="auth-page page-shell">
      <div className="auth-shell">
        <section className="auth-intro">
          <p className="eyebrow">Khmer Pride</p>
          <h1>{mode === 'register' ? 'Create an account' : mode === 'forgot' ? 'Recover your access' : mode === 'reset' ? 'Set a new password' : mode === 'verify' ? 'Confirm your email' : 'Welcome back'}</h1>
          <p>
            {mode === 'register'
              ? 'Join the Khmer Pride community and keep track of favourite pieces.'
              : mode === 'forgot'
                ? 'We will prepare a recovery link without making a network request.'
                : mode === 'reset'
                  ? 'Choose a new password for your Khmer Pride account.'
                  : mode === 'verify'
                    ? 'Your email verification screen is ready for the next integration step.'
                    : 'Sign in to continue browsing and check out seamlessly.'}
          </p>
        </section>

        <section className="auth-panel">
          {message ? <div className="auth-panel__status">{message}</div> : null}

          {mode === 'register' || mode === 'login' ? (
            <>
              <AuthForm mode={mode} onSubmit={handleAuthSubmit} loading={false} />
              <div className="auth-link-row">
                <Link to="/forgot-password">Forgot password?</Link>
                <Link to={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Create account' : 'Back to login'}</Link>
              </div>
            </>
          ) : null}

          {mode === 'forgot' ? (
            <form className="auth-form-grid" onSubmit={handleForgotSubmit}>
              <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
              <Button type="submit">Send link</Button>
              <div className="auth-link-row">
                <Link to="/login">Back to login</Link>
                <Link to="/register">Create account</Link>
              </div>
            </form>
          ) : null}

          {mode === 'reset' ? (
            <form className="auth-form-grid" onSubmit={handleResetSubmit}>
              <Input label="New password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter a new password" required />
              <Input label="Confirm password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter password" required />
              <Button type="submit">Save password</Button>
              <div className="auth-link-row">
                <Link to="/login">Back to login</Link>
              </div>
            </form>
          ) : null}

          {mode === 'verify' ? (
            <div className="auth-form-grid">
              <p>Verification is ready for the next backend step.</p>
              <Button to="/login">Back to login</Button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
