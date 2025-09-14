import React from 'react';

const ProductCard = ({ product, index }) => {
  const scarcityMessages = ['Only 2 left!', 'Only 1 left!', 'Low stock', 'Almost gone!'];
  const socialProof = ['43 people viewed today', '67 people viewed today', '29 people viewed today', '91 people viewed today'];

  const handleCardClick = () => {
    // Add ripple effect
    console.log(`Clicked on ${product.name}`);
  };

  const productEmojis = ['👗', '🌸', '💖', '👑', '✨', '💫', '💝'];

  return (
    <div className="product-card" onClick={handleCardClick} style={{background: 'linear-gradient(135deg, #fff, #f8e8ff)', border: '1px solid rgba(233, 30, 99, 0.1)'}}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div style={{position: 'absolute', top: '10px', left: '10px', fontSize: '1.5rem'}}>{productEmojis[index % 7]}</div>
      </div>
      <div className="product-info">
        <h3 style={{color: '#e91e63'}}>{product.name}</h3>
        <p className="price" style={{fontSize: '1.2rem', fontWeight: '700', color: '#e91e63'}}>{product.price}</p>
        <p className="scarcity-message" style={{color: '#e91e63'}}>
          ✨ {scarcityMessages[index % 4]}
        </p>
        <p className="social-proof">
          👑 {socialProof[index % 4]}
        </p>
        <p className="sizes">
          Sizes: {product.size.join(', ')}
        </p>
        <button className="btn product-btn" style={{background: 'linear-gradient(135deg, #e91e63, #f8e8ff)', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)'}}>
          Make It Mine ✨
        </button>
      </div>
    </div>
  );
};

export default ProductCard;