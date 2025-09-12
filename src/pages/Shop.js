import React, { useState } from 'react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import FilterButtons from '../components/FilterButtons';
import '../styles/shop.css';

function Shop() {
  const [filter, setFilter] = useState('all');
  
  const filteredProducts = filter === 'all' ? products : products.filter(product => product.category === filter);

  return (
    <div className="section">
      <div className="container">
        <h1>Shop All</h1>
        
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
            <button className="btn" style={{padding: '12px 30px'}}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;