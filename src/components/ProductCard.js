import React from 'react';

const ProductCard = ({ product, index }) => {
  const scarcityMessages = ['Only 2 left!', 'Only 1 left!', 'Low stock', 'Almost gone!'];
  const socialProof = ['43 people viewed today', '67 people viewed today', '29 people viewed today', '91 people viewed today'];

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{product.price}</p>
        <p className="scarcity-message">
          {scarcityMessages[index % 4]}
        </p>
        <p className="social-proof">
          👁️ {socialProof[index % 4]}
        </p>
        <p className="sizes">
          Your sizes: {product.size.join(', ')}
        </p>
        <button className="btn product-btn">
          Make It Mine
        </button>
      </div>
    </div>
  );
};

export default ProductCard;