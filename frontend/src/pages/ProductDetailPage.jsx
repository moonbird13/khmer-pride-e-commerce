import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import QuantitySelector from '../components/QuantitySelector/QuantitySelector.jsx';
import Rating from '../components/Rating/Rating.jsx';
import { getProductById, products as mockProducts } from '../data/products';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const product = useMemo(() => getProductById(id), [id]);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image || product.gallery?.[0] || '');
    }
  }, [product]);

  const relatedProducts = useMemo(() => mockProducts.filter((item) => item.id !== product?.id).slice(0, 4), [product]);

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
          <div className="product-detail-page__gallery-main">
            <img src={selectedImage} alt={product.name} />
          </div>
          <div className="product-detail-page__gallery-thumbs" role="list">
            {(product.gallery || [product.image]).map((imageUrl, index) => (
              <button
                key={imageUrl + index}
                type="button"
                className={`product-detail-page__gallery-thumb${selectedImage === imageUrl ? ' is-active' : ''}`}
                onClick={() => setSelectedImage(imageUrl)}
              >
                <img src={imageUrl} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail-page__info">
          <p className="eyebrow">{product.category || 'Featured'}</p>
          <h1>{product.name}</h1>
          <div className="product-detail-page__meta-grid">
            <div>
              <Rating value={product.rating || 0} showValue readOnly />
              <p className="product-detail-page__meta">{(product.rating || 0).toFixed(1)} rating</p>
            </div>
            <div>
              <p className="product-detail-page__meta">{product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
              <p className="product-detail-page__meta">Free delivery within Cambodia</p>
            </div>
          </div>
          <p className="product-detail-page__summary">{product.description}</p>
          <div className="product-detail-page__price">${Number(product.price).toFixed(2)}</div>

          <div className="product-detail-page__actions">
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <Button onClick={handleAddToCart}>Add to cart</Button>
            <Button to="/checkout" variant="secondary">Buy now</Button>
          </div>

          <div className="product-detail-page__section product-detail-page__section--shadow">
            <h2>Product details</h2>
            <p>{product.longDescription || product.description}</p>
            <ul className="product-detail-page__features">
              {product.features?.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="product-detail-page__section product-detail-page__related">
        <div className="product-detail-page__section-header">
          <h2>Related products</h2>
          <Button to="/products" variant="secondary" size="sm">View all</Button>
        </div>
        <div className="product-grid">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>
    </main>
  );
}
