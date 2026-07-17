import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProducts, getCategories } from '../../services/api';
import './ProductManagement.css';

const normalizeCategoryList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeCategoryOption = (category) => {
  const categoryId = category?.categoryId ?? category?.id ?? category?.category_id;
  const categoryName = category?.categoryName ?? category?.name ?? category?.category_name;

  return {
    categoryId,
    categoryName,
  };
};

export default function ProductManagement() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    categoryId: '',
    quantity: '',
    image: null,
  });

  // Fetch products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await getProducts();
      setProducts(Array.isArray(products) ? products : products.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      const normalizedCategories = normalizeCategoryList(cats)
        .map(normalizeCategoryOption)
        .filter((category) => category.categoryId != null && category.categoryName);

      setCategories(normalizedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        productName: product.name || '',
        productDescription: product.description || '',
        productPrice: product.price || '',
        categoryId: product.category?.id || product.category?.categoryId || '',
        quantity: product.quantity || '',
        image: null,
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setEditingProduct(null);
      setFormData({
        productName: '',
        productDescription: '',
        productPrice: '',
        categoryId: '',
        quantity: '',
        image: null,
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImagePreview(null);
    setFormData({
      productName: '',
      productDescription: '',
      productPrice: '',
      categoryId: '',
      quantity: '',
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('productName', formData.productName);
    data.append('productDescription', formData.productDescription);
    data.append('productPrice', formData.productPrice);
    data.append('categoryId', formData.categoryId);
    data.append('quantity', formData.quantity);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      let response;
      if (editingProduct) {
        response = await fetch(`http://localhost:3001/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: data,
        });
      } else {
        response = await fetch('http://localhost:3001/api/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: data,
        });
      }

      if (response.ok) {
        fetchProducts();
        handleCloseModal();
      } else {
        console.error('Error saving product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchProducts();
      } else {
        console.error('Error deleting product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category?.id === parseInt(selectedCategory))
    : products;

  return (
    <div className="product-management">
      <div className="panel-header">
        <h2>Product Management</h2>
        <p>Manage your product catalog with full CRUD operations.</p>
      </div>

      <div className="product-controls">
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Add New Product
        </button>

        <select
          className="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        <div className="product-list-header">
          <span className="col-image">Image</span>
          <span className="col-name">Product Name</span>
          <span className="col-category">Category</span>
          <span className="col-stock">Stock</span>
          <span className="col-price">Price</span>
          <span className="col-actions">Actions</span>
        </div>

        {loading ? (
          <p className="loading">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-item">
              <div className="col-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="product-thumbnail" />
                ) : (
                  <div className="product-thumbnail-placeholder">No Image</div>
                )}
              </div>
              <div className="col-name">{product.name}</div>
              <div className="col-category">{product.category?.name || '-'}</div>
              <div className="col-stock">{product.quantity || 0}</div>
              <div className="col-price">${product.price?.toFixed(2)}</div>
              <div className="col-actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleOpenModal(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Image</label>
                <div className="image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="productPrice"
                    value={formData.productPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
