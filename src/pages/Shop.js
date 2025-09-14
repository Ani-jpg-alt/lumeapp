import React, { useState } from 'react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import FilterButtons from '../components/FilterButtons';
import '../styles/shop.css';

function Shop() {
  const [filter, setFilter] = useState('all');
  
  const filteredProducts = filter === 'all' ? products : products.filter(product => product.category === filter);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(248,232,255,0.9), rgba(212,187,255,0.8)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&auto=format&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '4rem 0 2rem',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{fontSize: '3rem', color: '#333', textShadow: '2px 2px 4px rgba(255,255,255,0.8)'}}>✨ Princess Collection ✨</h1>
          <p style={{fontSize: '1.2rem', color: '#555'}}>Curated pieces for the modern queen 👑</p>
        </div>
      </section>

      <div className="section" style={{background: 'linear-gradient(135deg, #f8f9fa, #f0f8ff)'}}>
        <div className="container">
          <FilterButtons 
            categories={categories}
            activeFilter={filter}
            onFilterChange={setFilter}
          />

          <div className="product-grid">
            {filteredProducts.slice(0, 8).map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </div>
          
          {filteredProducts.length > 8 && (
            <div style={{textAlign: 'center', marginTop: '2rem'}}>
              <button className="btn" style={{padding: '12px 30px', background: 'linear-gradient(135deg, #e91e63, #f8e8ff)', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)'}}>Load More ✨</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;