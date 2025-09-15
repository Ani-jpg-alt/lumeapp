import React, { useState } from 'react';

const HomeProductCard = ({ product, addToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [product.image];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="product-card" style={{background: 'linear-gradient(135deg, #fff, #f8e8ff)', border: '1px solid rgba(233, 30, 99, 0.1)'}}>
      <div className="product-image" style={{position: 'relative'}}>
        <img src={images[currentImageIndex]} alt={product.name} />
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ‹
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ›
            </button>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '4px'
            }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: i === currentImageIndex ? '#e91e63' : 'rgba(255,255,255,0.5)'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="product-info">
        <h3 style={{color: '#e91e63'}}>{product.name}</h3>
        <p className="price" style={{fontSize: '1.2rem', fontWeight: '700'}}>{product.price}</p>
        {product.description && (
          <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>{product.description}</p>
        )}
        {product.colors && (
          <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>Colors: {product.colors.join(', ')}</p>
        )}
        {product.sizes && (
          <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>Sizes: {product.sizes.join(', ')}</p>
        )}
        <button 
          className="btn" 
          style={{width: '100%', fontSize: '0.8rem', background: 'linear-gradient(135deg, #e91e63, #f8e8ff)', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)'}}
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default HomeProductCard;