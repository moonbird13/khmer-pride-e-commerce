import Rating from './Rating';

export default function ReviewCard({ review, className = '' }) {
  return (
    <article className={`ui-card ui-review-card ${className}`.trim()}>
      <Rating value={review?.rating || 5} readOnly />
      <p>“{review?.comment || 'A thoughtful experience from start to finish.'}”</p>
      <div className="ui-review-card__meta">
        <strong>{review?.author || 'Happy shopper'}</strong>
        <span className="ui-card__meta">{review?.role || 'Verified buyer'}</span>
      </div>
    </article>
  );
}
