export default function ReviewCard({ review }) {
  return (
    <article className="product-card">
      <p>“{review.comment}”</p>
      <strong>{review.author}</strong>
      <span className="muted">{review.role}</span>
    </article>
  );
}
