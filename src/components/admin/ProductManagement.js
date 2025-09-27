import React, { useState, useEffect } from 'react';
import { products, categories } from '../../data/products';
import CloudinaryUpload from './CloudinaryUpload';

export default function ProductManagement() {
  const [productList, setProductList] = useState(products);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'dresses',
    sizes: [],
    colors: [],
    description: '',
    image: '',
    images: []
  });

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const availableColors = ['Black', 'White', 'Pink', 'Blue', 'Green', 'Red', 'Purple', 'Yellow', 'Orange', 'Gray'];

  const filteredProducts = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleImageUpload = (imageUrl) => {
    if (!formData.image) {
      setFormData(prev => ({
        ...prev,
        image: imageUrl,
        images: [imageUrl, ...prev.images]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: index === 0 && newImages.length > 0 ? newImages[0] : prev.image
      };
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'dresses',
      sizes: [],
      colors: [],
      description: '',
      image: '',
      images: []
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description || formData.sizes.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const newProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      ...formData,
      price: formData.price.startsWith('R') ? formData.price : `R${formData.price}`
    };

    if (editingProduct) {
      setProductList(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProductList(prev => [...prev, newProduct]);
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price.replace('R', ''),
      category: product.category,
      sizes: product.sizes || [],
      colors: product.colors || [],
      description: product.description,
      image: product.image,
      images: product.images || []
    });
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProductList(prev => prev.filter(p => p.id !== productId));
    }
  };

  return (
    <div className="product-management">
      <div className="section-header">
        <h2>Product Management</h2>
        <button
          className="admin-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          ➕ Add New Product
        </button>
      </div>

      {showAddForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>

          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price (without R) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories.filter(cat => cat.id !== 'all').map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Available Sizes *</label>
            <div className="checkbox-group">
              {availableSizes.map(size => (
                <label key={size} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Available Colors</label>
            <div className="checkbox-group">
              {availableColors.map(color => (
                <label key={color} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.colors.includes(color)}
                    onChange={() => handleColorChange(color)}
                  />
                  {color}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Product Images</label>
            <CloudinaryUpload onImageUpload={handleImageUpload} />

            {formData.images.length > 0 && (
              <div className="image-preview">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Product ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ❌
                    </button>
                    {index === 0 && <span className="main-image">Main</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="admin-btn success">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" className="admin-btn secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card-admin">
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">{product.price}</p>
              <p className="category">{categories.find(cat => cat.id === product.category)?.name}</p>
              <p className="description">{product.description}</p>
              <div className="sizes">
                <strong>Sizes:</strong> {product.sizes?.join(', ')}
              </div>
              {product.colors && product.colors.length > 0 && (
                <div className="colors">
                  <strong>Colors:</strong> {product.colors.join(', ')}
                </div>
              )}
            </div>
            <div className="product-actions">
              <button
                className="admin-btn"
                onClick={() => handleEdit(product)}
              >
                ✏️ Edit
              </button>
              <button
                className="admin-btn danger"
                onClick={() => handleDelete(product.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
}