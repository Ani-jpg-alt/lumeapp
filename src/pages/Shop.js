import React, { useState } from 'react';

function Shop() {
  const [filter, setFilter] = useState('all');
  
  const products = [
    { id: 1, name: 'Silk Midi Dress', price: 'R1,599', category: 'dresses', size: ['XS', 'S', 'M', 'L'], image: 'Silk Midi Dress' },
    { id: 2, name: 'Linen Wrap Dress', price: 'R1,349', category: 'dresses', size: ['S', 'M', 'L', 'XL'], image: 'Linen Wrap Dress' },
    { id: 3, name: 'Cotton Sundress', price: 'R1,169', category: 'dresses', size: ['XS', 'S', 'M'], image: 'Cotton Sundress' },
    { id: 4, name: 'Chiffon Maxi', price: 'R1,699', category: 'dresses', size: ['S', 'M', 'L'], image: 'Chiffon Maxi' },
    { id: 5, name: 'Leather Waist Band', price: 'R629', category: 'accessories', size: ['S', 'M', 'L'], image: 'Leather Waist Band' },
    { id: 6, name: 'Chain Waist Band', price: 'R809', category: 'accessories', size: ['One Size'], image: 'Chain Waist Band' },
    { id: 7, name: 'Summer Slip Dress', price: 'R809', category: 'sale', size: ['XS', 'S', 'M', 'L'], image: 'Summer Slip Dress' },
    { id: 8, name: 'Boho Midi Dress', price: 'R989', category: 'sale', size: ['S', 'M', 'L'], image: 'Boho Midi Dress' }
  ];

  const filteredProducts = filter === 'all' ? products : products.filter(product => product.category === filter);

  return (
    <div className="section">
      <div className="container">
        <h1>Shop All</h1>
        
        {/* Filter Buttons */}
        <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap'}}>
          <button 
            className="btn"
            onClick={() => setFilter('all')}
            style={{background: filter === 'all' ? '#C8A8D8' : '#F0F0F0', color: filter === 'all' ? 'white' : '#6B5B73'}}
          >
            All
          </button>
          <button 
            className="btn"
            onClick={() => setFilter('dresses')}
            style={{background: filter === 'dresses' ? '#C8A8D8' : '#F0F0F0', color: filter === 'dresses' ? 'white' : '#6B5B73'}}
          >
            Dresses
          </button>
          <button 
            className="btn"
            onClick={() => setFilter('accessories')}
            style={{background: filter === 'accessories' ? '#C8A8D8' : '#F0F0F0', color: filter === 'accessories' ? 'white' : '#6B5B73'}}
          >
            Accessories
          </button>
          <button 
            className="btn"
            onClick={() => setFilter('sale')}
            style={{background: filter === 'sale' ? '#C8A8D8' : '#F0F0F0', color: filter === 'sale' ? 'white' : '#6B5B73'}}
          >
            Sale
          </button>
        </div>

        {/* Products Grid */}
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">{product.price}</p>
                <p style={{fontSize: '0.9rem', color: '#999'}}>
                  Your sizes: {product.size.join(', ')}
                </p>
                <button className="btn" style={{marginTop: '10px', width: '100%'}}>
                  Make It Mine
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;