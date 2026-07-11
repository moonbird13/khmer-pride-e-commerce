import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector.jsx';
import Rating from '../components/Rating/Rating.jsx';
import ReviewCard from '../components/ReviewCard/ReviewCard.jsx';
import { getProductById, products, reviews } from '../data/mockData';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = getProductById(id) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const relatedProducts = useMemo(() => products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 2), [product.category, product.id]);

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
          <div className="product-detail-page__gallery-main">{product.gallery[selectedImage] || product.image}</div>
          <div className="product-detail-page__gallery-thumbs" role="list">
            {product.gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`product-detail-page__gallery-thumb${selectedImage === index ? ' is-active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                {image}
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail-page__info">
          <p className="eyebrow">{product.badge}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-page__meta">{product.description}</p>
          <Rating value={product.rating} showValue readOnly />
          <div className="product-detail-page__price">${product.price.toFixed(2)}</div>
          <p className="product-detail-page__meta">In stock: {product.stock} units</p>

          <div className="product-detail-page__actions">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <Button>Add to cart</Button>
            <Button to="/checkout" variant="secondary">Checkout</Button>
          </div>

          <div className="product-detail-page__section">
            <h2>Product details</h2>
            <p>{product.longDescription}</p>
            <ul className="product-detail-page__features">
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="product-detail-page__section">
        <h2>Customer reviews</h2>
        <div className="product-grid">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
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
