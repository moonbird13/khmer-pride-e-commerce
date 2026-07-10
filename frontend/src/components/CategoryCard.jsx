export default function CategoryCard({ category }) {
  return (
    <article className="product-card">
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </article>
  );
}
