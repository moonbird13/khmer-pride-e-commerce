import { useState } from 'react';
import Button from './Button';
import Input from './Input';

export default function AuthForm({ mode, onSubmit, loading, error }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ fullName, email, password });
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2>
      <p>Discover authentic Cambodian products with Khmer Pride.</p>
      {error ? <div className="error-box">{error}</div> : null}
      {mode === 'register' ? (
        <Input
          label="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
          required
        />
      ) : null}
      <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" required />
      <Input label="Password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" required />
      <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : mode === 'register' ? 'Register' : 'Login'}</Button>
    </form>
  );
}
