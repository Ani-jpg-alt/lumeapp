import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartIcon() {
  const { getTotalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div 
      onClick={handleCartClick}
      style={{
        position: 'relative',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(233, 30, 99, 0.1)'}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ color: '#e91e63' }}
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="m1 1 4 4 13 0 3 8-13 0"></path>
      </svg>
      
      <span style={{ 
        color: '#e91e63', 
        fontWeight: 'bold',
        fontSize: '0.9rem'
      }}>
        Cart
      </span>
      
      {totalItems > 0 && (
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          backgroundColor: '#e91e63',
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          minWidth: '20px'
        }}>
          {totalItems > 99 ? '99+' : totalItems}
        </div>
      )}
    </div>
  );
}
