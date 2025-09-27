import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import PaymentDashboard from '../components/admin/PaymentDashboard';
import CategoryManagement from '../components/admin/CategoryManagement';
import '../styles/admin.css';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'Product Management', icon: '📦' },
    { id: 'categories', label: 'Categories', icon: '📂' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'payments', label: 'Payments', icon: '💳' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'payments':
        return <PaymentDashboard />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {currentUser?.email}</p>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {renderActiveTab()}
      </div>
    </div>
  );
}