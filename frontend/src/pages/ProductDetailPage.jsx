import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector.jsx';
import { getProductById, products as mockProducts } from '../data/products';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const product = useMemo(() => getProductById(id), [id]);
  const relatedProducts = useMemo(() => mockProducts.filter((item) => item.id !== product?.id).slice(0, 2), [product]);

  const { addToCart } = useCart();
  const handleAddToCart = () => addToCart(product, quantity);

  if (!product) {
    return <main className="product-detail-page page-shell"><p>Loading product...</p></main>;
  }

  return (
    <main className="product-detail-page page-shell">
      <nav className="product-detail-page__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <section className="product-detail-page__layout">
        <div className="product-detail-page__gallery">
          <div className="product-detail-page__gallery-main">{product.image || product.category?.name || 'Product'}</div>
          <div className="product-detail-page__gallery-thumbs" role="list">
            <button type="button" className="product-detail-page__gallery-thumb is-active">{product.name}</button>
          </div>
        </div>

        <div className="product-detail-page__info">
          <p className="eyebrow">{product.category?.name || 'Featured'}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-page__meta">{product.description}</p>
          <div className="product-detail-page__price">${Number(product.price).toFixed(2)}</div>
          <p className="product-detail-page__meta">Featured: {product.isFeatured ? 'Yes' : 'No'}</p>

          <div className="product-detail-page__actions">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <Button onClick={handleAddToCart}>Add to cart</Button>
            <Button to="/checkout" variant="secondary">Checkout</Button>
          </div>

          <div className="product-detail-page__section">
            <h2>Product details</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </section>

      <section className="product-detail-page__section">
        <h2>Customer reviews</h2>
        <div className="product-grid">
          <p>No reviews are currently available for this product.</p>
        </div>
      </section>

      <section className="product-detail-page__section">
        <h2>Related products</h2>
        <div className="product-grid">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
