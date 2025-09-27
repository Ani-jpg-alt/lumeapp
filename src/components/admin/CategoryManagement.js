import React, { useState } from 'react';
import { categories } from '../../data/products';

export default function CategoryManagement() {
  const [categoryList, setCategoryList] = useState(categories.filter(cat => cat.id !== 'all'));
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setEditingCategory(null);
    setShowAddForm(false);
  };

  const generateId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    const categoryId = editingCategory ? editingCategory.id : generateId(formData.name);

    // Check if category ID already exists (for new categories)
    if (!editingCategory && categoryList.some(cat => cat.id === categoryId)) {
      alert('A category with this name already exists');
      return;
    }

    const newCategory = {
      id: categoryId,
      name: formData.name.trim(),
      description: formData.description.trim()
    };

    if (editingCategory) {
      setCategoryList(prev => prev.map(cat => cat.id === editingCategory.id ? newCategory : cat));
    } else {
      setCategoryList(prev => [...prev, newCategory]);
    }

    resetForm();
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategoryList(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  return (
    <div className="category-management">
      <div className="section-header">
        <h2>Category Management</h2>
        <button
          className="admin-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          ➕ Add New Category
        </button>
      </div>

      {showAddForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>

          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Dresses, Accessories, Gym Sets"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description for this category"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="admin-btn success">
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
            <button type="button" className="admin-btn secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="categories-grid">
        {categoryList.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-info">
              <h3>{category.name}</h3>
              <p className="category-id">ID: {category.id}</p>
              {category.description && (
                <p className="category-description">{category.description}</p>
              )}
            </div>
            <div className="category-actions">
              <button
                className="admin-btn"
                onClick={() => handleEdit(category)}
              >
                ✏️ Edit
              </button>
              <button
                className="admin-btn danger"
                onClick={() => handleDelete(category.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {categoryList.length === 0 && (
        <div className="no-categories">
          <p>No categories found. Add your first category to get started!</p>
        </div>
      )}

      <div className="category-info-box">
        <h3>ℹ️ Category Management Tips</h3>
        <ul>
          <li>Category IDs are automatically generated from the name</li>
          <li>Make sure to update existing products when deleting categories</li>
          <li>Keep category names clear and descriptive</li>
          <li>The "All" category is built-in and cannot be modified</li>
        </ul>
      </div>
    </div>
  );
}