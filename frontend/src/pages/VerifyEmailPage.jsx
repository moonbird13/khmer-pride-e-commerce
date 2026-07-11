import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import './AuthPage.css';

export default function VerifyEmailPage() {
  const { token } = useParams();

  return (
    <main className="auth-page page-shell">
      <section className="auth-panel">
        <p className="eyebrow">Verify email</p>
        <h1>Confirm your account.</h1>
        <p className="hero-copy">
          {token ? `We are validating your verification token ${token}.` : 'Use the link sent to your inbox to confirm your account.'}
        </p>
        <div className="auth-panel__actions">
          <Button to="/login">Back to sign in</Button>
          <Button to="/" variant="secondary">Go home</Button>
        </div>
        <p className="auth-panel__footer">
          Need another email? <Link to="/forgot-password">Resend instructions</Link>
        </p>
      </section>
    </main>
  );
}
