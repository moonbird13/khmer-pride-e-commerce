import { useEffect, useMemo, useState } from 'react';
import api, { getCategories, getProducts } from '../../services/api';
import './StaffRequests.css';

const requestTypeOptions = [
  { value: 'Inventory', label: 'Inventory Restock' },
  { value: 'Create', label: 'Create Product' },
  { value: 'Delete', label: 'Delete Product' },
];

export default function StaffRequests() {
  const [requestType, setRequestType] = useState('Inventory');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [requests, setRequests] = useState({ inventory: [], products: [] });
  const [loading, setLoading] = useState(false);
  const [submitState, setSubmitState] = useState({ message: '', error: '' });
  const [formValues, setFormValues] = useState({
    productId: '',
    currentStock: '',
    requestedStock: '',
    reason: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    categoryId: '',
    initialStock: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchRequests();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await getProducts();
      setProducts(Array.isArray(result) ? result : result.products || []);
    } catch (error) {
      console.error('Unable to load products', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      const list = Array.isArray(result)
        ? result
        : result.categories || result.data || [];
      setCategories(list);
    } catch (error) {
      console.error('Unable to load categories', error);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/requests/mine');
      setRequests({
        inventory: data.inventory || [],
        products: data.products || [],
      });
    } catch (error) {
      console.error('Unable to load requests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormValues({
      productId: '',
      currentStock: '',
      requestedStock: '',
      reason: '',
      productName: '',
      productDescription: '',
      productPrice: '',
      categoryId: '',
      initialStock: '',
      imageUrl: '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ message: '', error: '' });

    try {
      if (requestType === 'Inventory') {
        const payload = {
          productId: formValues.productId,
          currentStock: Number(formValues.currentStock),
          requestedStock: Number(formValues.requestedStock),
          reason: formValues.reason,
        };
        await api.post('/requests/inventory', payload);
      } else {
        const payload = {
          requestType,
          reason: formValues.reason,
        };

        if (requestType === 'Create') {
          Object.assign(payload, {
            productName: formValues.productName,
            productDescription: formValues.productDescription,
            productPrice: Number(formValues.productPrice),
            categoryId: formValues.categoryId,
            initialStock: Number(formValues.initialStock),
            imageUrl: formValues.imageUrl || null,
          });
        }

        if (requestType === 'Delete') {
          payload.productId = formValues.productId;
        }

        await api.post('/requests/products', payload);
      }

      setSubmitState({ message: 'Request submitted successfully.', error: '' });
      resetForm();
      fetchRequests();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Unable to submit request.';
      setSubmitState({ message: '', error });
      setSubmitState({ message: '', error: message });
    }
  };

  const currentRequestLabel = useMemo(() => {
    if (requestType === 'Inventory') return 'Inventory request';
    if (requestType === 'Create') return 'Create product request';
    return 'Delete product request';
  }, [requestType]);

  return (
    <div className="staff-requests">
      <div className="panel-header">
        <h2>Staff Request Center</h2>
        <p>Submit staff requests for inventory restock or product creation and deletion.</p>
      </div>

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-row request-type-row">
          <label>Request type</label>
          <select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
            {requestTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {requestType === 'Inventory' && (
          <>
            <div className="form-row">
              <label>Product</label>
              <select
                required
                value={formValues.productId}
                onChange={(e) => handleChange('productId', e.target.value)}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.productId || product.id} value={product.productId || product.id}>
                    {product.productName || product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Current stock</label>
              <input
                type="number"
                min="0"
                value={formValues.currentStock}
                onChange={(e) => handleChange('currentStock', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>Requested stock</label>
              <input
                type="number"
                min="1"
                value={formValues.requestedStock}
                onChange={(e) => handleChange('requestedStock', e.target.value)}
                required
              />
            </div>
          </>
        )}

        {requestType === 'Create' && (
          <>
            <div className="form-row">
              <label>Product name</label>
              <input
                type="text"
                value={formValues.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>Category</label>
              <select
                required
                value={formValues.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.categoryId || category.id} value={category.categoryId || category.id}>
                    {category.categoryName || category.categoryName || category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formValues.productPrice}
                onChange={(e) => handleChange('productPrice', e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>Starting stock</label>
              <input
                type="number"
                min="0"
                value={formValues.initialStock}
                onChange={(e) => handleChange('initialStock', e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={formValues.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                rows="3"
                value={formValues.productDescription}
                onChange={(e) => handleChange('productDescription', e.target.value)}
              />
            </div>
          </>
        )}

        {requestType === 'Delete' && (
          <div className="form-row">
            <label>Product to delete</label>
            <select
              required
              value={formValues.productId}
              onChange={(e) => handleChange('productId', e.target.value)}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.productId || product.id} value={product.productId || product.id}>
                  {product.productName || product.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-row">
          <label>Reason</label>
          <textarea
            rows="3"
            value={formValues.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            required
          />
        </div>

        {submitState.error && <div className="form-error">{submitState.error}</div>}
        {submitState.message && <div className="form-success">{submitState.message}</div>}

        <div className="form-actions">
          <button className="btn btn-primary" type="submit">Submit {currentRequestLabel}</button>
          <button className="btn btn-secondary" type="button" onClick={resetForm}>Reset</button>
        </div>
      </form>

      <div className="request-history">
        <h3>Your recent requests</h3>
        {loading ? (
          <p>Loading requests...</p>
        ) : (
          <>
            <section className="request-table">
              <h4>Inventory requests</h4>
              {requests.inventory.length === 0 ? (
                <p>No inventory requests submitted yet.</p>
              ) : (
                <div className="request-list">
                  {requests.inventory.map((item) => (
                    <div key={item.inventoryRequestId || item.id} className="request-card">
                      <div className="request-card__header">
                        <strong>{item.status}</strong>
                        <span>{new Date(item.requestedAt || item.requested_at).toLocaleDateString()}</span>
                      </div>
                      <p><strong>Product:</strong> {item.product?.productName || item.productName || 'Unknown'}</p>
                      <p><strong>Requested:</strong> {item.requestedStock} (Current {item.currentStock})</p>
                      {item.reviewNote && <p><strong>Note:</strong> {item.reviewNote}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="request-table">
              <h4>Product requests</h4>
              {requests.products.length === 0 ? (
                <p>No product requests submitted yet.</p>
              ) : (
                <div className="request-list">
                  {requests.products.map((item) => (
                    <div key={item.productRequestId || item.id} className="request-card">
                      <div className="request-card__header">
                        <strong>{item.status}</strong>
                        <span>{new Date(item.requestedAt || item.requested_at).toLocaleDateString()}</span>
                      </div>
                      <p><strong>Type:</strong> {item.requestType}</p>
                      <p><strong>Product:</strong> {item.productName || item.product?.productName || 'Unknown'}</p>
                      <p><strong>Reason:</strong> {item.reason}</p>
                      {item.reviewNote && <p><strong>Note:</strong> {item.reviewNote}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
