import { useState } from 'react';
import Button from './Button';
import Input from './Input';

export default function Newsletter({
  title = 'Stay in the loop',
  description = 'Get product launches, offers, and local stories delivered to your inbox.',
  buttonLabel = 'Subscribe',
  onSubmit,
  className = '',
}) {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    onSubmit?.(trimmedEmail);
    setEmail('');
  };

  return (
    <section className={`ui-newsletter ${className}`.trim()}>
      <div>
        <p className="ui-eyebrow">Newsletter</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <form className="ui-newsletter__form" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="ui-newsletter__field"
        />
        <Button type="submit" variant="secondary">{buttonLabel}</Button>
      </form>
    </section>
  );
}
