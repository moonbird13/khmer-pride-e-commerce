import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '../../services/api';
import './InventoryManagement.css';

const LOW_STOCK_THRESHOLD = 20;

export default function InventoryManagement({ onRequestStock }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('quantity-asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const result = await getProducts();
        setProducts(Array.isArray(result) ? result : result.products || []);
      } catch {
        setError('Unable to load inventory.');
      } finally {
        setLoading(false);
      }
    };
    loadInventory();
  }, []);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = products.filter((product) => (product.name || product.productName || '').toLowerCase().includes(query));
    return next.sort((a, b) => sort === 'quantity-asc'
      ? Number(a.quantity || 0) - Number(b.quantity || 0)
      : Number(b.quantity || 0) - Number(a.quantity || 0));
  }, [products, search, sort]);

  return (
    <div className="inventory-management">
      <div className="inventory-heading">
        <h2>Inventory</h2>
        <p>Stock at {LOW_STOCK_THRESHOLD} units or fewer is low stock.</p>
      </div>
      <div className="inventory-controls">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search inventory by product name" aria-label="Search inventory" />
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort inventory by quantity">
          <option value="quantity-asc">Quantity: low to high</option>
          <option value="quantity-desc">Quantity: high to low</option>
        </select>
      </div>
      <div className="inventory-table">
        <div className="inventory-row inventory-row--header"><span>Product</span><span>Quantity</span><span>Status</span>{onRequestStock && <span>Action</span>}</div>
        {loading ? <p>Loading inventory...</p> : error ? <p className="inventory-error">{error}</p> : visibleProducts.length === 0 ? <p>No matching products found.</p> : visibleProducts.map((product) => {
          const isLowStock = Number(product.quantity || 0) <= LOW_STOCK_THRESHOLD;
          return <div className="inventory-row" key={product.id || product.productId}>
            <span>{product.name || product.productName}</span>
            <strong className={isLowStock ? 'inventory-low' : 'inventory-available'}>{Number(product.quantity || 0)}</strong>
            <span className={isLowStock ? 'inventory-low inventory-status' : 'inventory-available inventory-status'}>{isLowStock ? 'Low stock' : 'In stock'}</span>
            {onRequestStock && <span>{isLowStock && <button onClick={() => onRequestStock(product)}>Request stock</button>}</span>}
          </div>;
        })}
      </div>
    </div>
  );
}
