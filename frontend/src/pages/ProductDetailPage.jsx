import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { api, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Product load failed', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [api, id]);

  const handleAddToCart = async () => {
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 });
      setMessage(`${product.name} added to cart.`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to add item to cart.');
    }
  };

  if (loading) {
    return <div className="page-shell"><p>Loading product...</p></div>;
  }

  if (!product) {
    return <div className="page-shell"><h1>Product not found</h1><Link className="secondary-btn" to="/products">Back to products</Link></div>;
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Product detail</p>
          <h1>{product.name}</h1>
          <p className="hero-copy">A closer look at this curated Khmer Pride item.</p>
        </div>
        <div className="page-actions">
          <Link className="secondary-btn" to="/products">Browse products</Link>
          {user ? <Link className="primary-btn" to="/cart">View cart</Link> : <Link className="primary-btn" to="/login">Login to purchase</Link>}
        </div>
      </div>

      <section className="product-card">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        {message ? <div className="error-box">{message}</div> : null}
        <div className="card-actions">
          {user ? (
            <button className="primary-btn" onClick={handleAddToCart}>Add to cart</button>
          ) : (
            <Link className="primary-btn" to="/login">Login to buy</Link>
          )}
          <Link className="secondary-btn" to="/checkout">Go to checkout</Link>
        </div>
      </section>
    </div>
  );
}
