import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const ProductCard = ({ product, index }) => {
  const { addToCart, getItemQuantity } = useCart();
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, setSelectedSize] = useState(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  
  const images = product.images || [product.image];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const scarcityMessages = ['Only 2 left!', 'Only 1 left!', 'Low stock', 'Almost gone!'];
  const socialProof = ['43 people viewed today', '67 people viewed today', '29 people viewed today', '91 people viewed today'];

  const handleCardClick = () => {
    console.log(`Clicked on ${product.name}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    // Security check: Must be authenticated to add to cart
    if (!currentUser) {
      // Show authentication required message
      showNotification('Please log in to add items to your cart.', 'warning');
      setTimeout(() => {
        window.location.href = '/auth';
      }, 1500);
      return;
    }

    // Additional security: Ensure product exists and has valid data
    if (!product || !product.id || !product.name || !product.price) {
      showNotification('Invalid product. Please try again.', 'error');
      return;
    }

    if (product.sizes && product.sizes.length > 0) {
      setShowSizeSelector(true);
    } else {
      addToCart(product);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    addToCart(product, size);
    setShowSizeSelector(false);
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{background: 'linear-gradient(135deg, #fff, #f8e8ff)', border: '1px solid rgba(233, 30, 99, 0.1)'}}>
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
        <p className="price" style={{fontSize: '1.2rem', fontWeight: '700', color: '#e91e63'}}>{product.price}</p>
        <p className="scarcity-message" style={{color: '#e91e63'}}>
          {scarcityMessages[index % 4]}
        </p>
        <p className="social-proof">
          {socialProof[index % 4]}
        </p>
        {product.sizes && product.sizes.length > 0 && (
          <p className="sizes">
            Sizes: {product.sizes.join(', ')}
          </p>
        )}
        <button
          className="btn product-btn"
          style={{background: 'linear-gradient(135deg, #e91e63, #f8e8ff)', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)'}}
          onClick={handleAddToCart}
        >
          {currentUser ? (() => {
            const totalInCart = product.sizes ?
              product.sizes.reduce((total, size) => total + getItemQuantity(product.id, size), 0) :
              getItemQuantity(product.id);
            return totalInCart > 0 ? `${totalInCart} in cart` : 'Add to Cart';
          })() : 'Login to Buy'}
        </button>
      </div>
      
      {showSizeSelector && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#e91e63', marginBottom: '1rem' }}>Select Size</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Choose a size for {product.name}</p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  style={{
                    padding: '1rem',
                    border: '2px solid #e91e63',
                    background: 'white',
                    color: '#e91e63',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e91e63';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = '#e91e63';
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowSizeSelector(false)}
              style={{
                padding: '0.75rem 2rem',
                background: 'transparent',
                color: '#666',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;