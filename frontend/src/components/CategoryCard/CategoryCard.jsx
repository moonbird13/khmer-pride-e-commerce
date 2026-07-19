import { Link } from 'react-router-dom';
import './CategoryCard.css';

export function CategoryIcon({ name }) {
  const label = (name || '').toLowerCase();
  let icon = <><path d="M7 10h10v10H7z" /><path d="M12 10V5M9 5h6" /></>;

  if (label.includes('snack') || label.includes('food') || label.includes('spice')) {
    icon = <><path d="M7 4v16M17 4v16M4 8h6M14 8h6" /><path d="M9 4c2 2 2 4 0 6M15 4c-2 2-2 4 0 6" /></>;
  } else if (label.includes('tea') || label.includes('coffee')) {
    icon = <><path d="M6 9h10v7a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V9Z" /><path d="M16 11h1a2 2 0 0 1 0 4h-1M8 5c0 1 .8 1.4.8 2.4M12 5c0 1 .8 1.4.8 2.4" /></>;
  } else if (label.includes('fashion') || label.includes('accessor')) {
    icon = <><path d="m8 5 4-2 4 2 4 3-2 4-2-1v9H8v-9l-2 1-2-4 4-3Z" /></>;
  } else if (label.includes('skin') || label.includes('beauty')) {
    icon = <><path d="M9 4h6v4H9zM8 8h8v12H8z" /><path d="M10.5 12h3M10.5 15h3" /></>;
  } else if (label.includes('woven') || label.includes('gift')) {
    icon = <><path d="M5 9h14v11H5zM4 9V6h16v3M12 6v14" /><path d="M5 12h14" /></>;
  } else if (label.includes('farm') || label.includes('natural')) {
    icon = <><path d="M12 20V10M12 13c-5 0-7-3-7-7 5 0 7 3 7 7ZM12 16c4 0 6-2 6-6-4 0-6 2-6 6Z" /></>;
  }

  return <svg className="ui-category-card__icon" viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>;
}

export default function CategoryCard({ category, compact = false, className = '' }) {
  const { name = 'Category', description = 'A curated selection for your next purchase.', count, image } = category || {};

  if (compact) {
    return (
      <Link className={`ui-category-icon-card ${className}`.trim()} to={`/products?category=${encodeURIComponent(String(category?.id ?? ''))}`}>
        <CategoryIcon name={name} />
        <span>{name}</span>
      </Link>
    );
  }

  return (
    <Link className={`ui-card ui-category-card ${className}`.trim()} to={`/products?category=${encodeURIComponent(String(category?.id ?? ''))}`}>
      <div className="ui-category-card__image">
        {image ? <img src={image} alt="" /> : <CategoryIcon name={name} />}
      </div>
      <div className="ui-category-card__content">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      {count != null ? <span className="ui-card__meta">{count} items</span> : null}
    </Link>
  );
}
