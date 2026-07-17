import './CategoryCard.css';

export default function CategoryCard({ category, className = '' }) {
  const { name = 'Category', description = 'A curated selection for your next purchase.', count, image } = category || {};

  const renderImage = () => {
    if (typeof image === 'string' && /^https?:\/\//.test(image)) {
      return <img src={image} alt={name} className="ui-category-card__image-media" />;
    }

    return <div className="ui-category-card__icon-placeholder">{image || name?.charAt(0)}</div>;
  };

  return (
    <article className={`ui-card ui-category-card ${className}`.trim()}>
      <div className="ui-category-card__image">{renderImage()}</div>
      <div className="ui-category-card__content">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      {count != null ? <span className="ui-card__meta">{count} items</span> : null}
    </article>
  );
}
