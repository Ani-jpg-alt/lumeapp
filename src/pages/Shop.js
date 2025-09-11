import React, { useState } from 'react';

function Shop() {
  const [filter, setFilter] = useState('all');
  
  const products = [
    { id: 1, name: 'Silk Midi Dress', price: 'R1,599', category: 'dresses', size: ['XS', 'S', 'M', 'L'], image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 2, name: 'Linen Wrap Dress', price: 'R1,349', category: 'dresses', size: ['S', 'M', 'L', 'XL'], image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 3, name: 'Cotton Sundress', price: 'R1,169', category: 'dresses', size: ['XS', 'S', 'M'], image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 4, name: 'Chiffon Maxi', price: 'R1,699', category: 'dresses', size: ['S', 'M', 'L'], image: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e8?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 5, name: 'Leather Waist Band', price: 'R629', category: 'accessories', size: ['S', 'M', 'L'], image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 6, name: 'Chain Waist Band', price: 'R809', category: 'accessories', size: ['One Size'], image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 7, name: 'Summer Slip Dress', price: 'R809', category: 'sale', size: ['XS', 'S', 'M', 'L'], image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 8, name: 'Boho Midi Dress', price: 'R989', category: 'sale', size: ['S', 'M', 'L'], image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d24?w=400&h=500&fit=crop&auto=format&q=80' }
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
            style={{background: filter === 'all' ? '#000000' : '#F5F5DC', color: filter === 'all' ? 'white' : '#2D2D2D', border: filter === 'all' ? 'none' : '1px solid #D2B48C'}}
          >
            All
          </button>
          <button 
            className="btn"
            onClick={() => setFilter('dresses')}
            style={{background: filter === 'dresses' ? '#000000' : '#F5F5DC', color: filter === 'dresses' ? 'white' : '#2D2D2D', border: filter === 'dresses' ? 'none' : '1px solid #D2B48C'}}
          >
            Dresses
          </button>
          <button 
            className="btn"
            onClick={() => setFilter('accessories')}
            style={{background: filter === 'accessories' ? '#000000' : '#F5F5DC', color: filter === 'accessories' ? 'white' : '#2D2D2D', border: filter === 'accessories' ? 'none' : '1px solid #D2B48C'}}
          >
            Accessories
          </button>
          <button 
            className="btn"
            onClick={() => setFilter('sale')}
            style={{background: filter === 'sale' ? '#000000' : '#F5F5DC', color: filter === 'sale' ? 'white' : '#2D2D2D', border: filter === 'sale' ? 'none' : '1px solid #D2B48C'}}
          >
            Sale
          </button>
        </div>

        {/* Products Grid */}
        <div className="product-grid">
          {filteredProducts.slice(0, 8).map((product, index) => {
            const scarcityMessages = ['Only 2 left!', 'Only 1 left!', 'Low stock', 'Almost gone!'];
            const socialProof = ['43 people viewed today', '67 people viewed today', '29 people viewed today', '91 people viewed today'];
            const urgency = product.category === 'sale' ? 'Sale ends in 1 day!' : null;
            
            return (
              <div key={product.id} className="product-card">
                {urgency && (
                  <div style={{background: '#FF6B6B', color: 'white', padding: '4px 8px', fontSize: '0.7rem', fontWeight: '600', textAlign: 'center'}}>
                    ⏰ {urgency}
                  </div>
                )}
                <div className="product-image" style={{position: 'relative'}}>
                  <img src={product.image} alt={product.name} />
                  {product.category === 'sale' && (
                    <div style={{position: 'absolute', top: '15px', left: '15px', background: '#FF6B6B', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600'}}>SALE</div>
                  )}
                  <div style={{position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '8px', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s ease'}}>
                    <span style={{fontSize: '1.1rem'}}>🤍</span>
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <p style={{fontSize: '0.8rem', color: '#FF6B6B', fontWeight: '600', marginBottom: '4px'}}>
                    {scarcityMessages[index % 4]}
                  </p>
                  <p style={{fontSize: '0.8rem', color: '#8B7B93', marginBottom: '8px'}}>
                    👁️ {socialProof[index % 4]}
                  </p>
                  <p style={{fontSize: '0.9rem', color: '#999', marginBottom: '8px'}}>
                    Your sizes: {product.size.join(', ')}
                  </p>
                  <button className="btn" style={{marginTop: '10px', width: '100%'}}>
                    Make It Mine
                  </button>
                </div>
              </div>
            );
          })}
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