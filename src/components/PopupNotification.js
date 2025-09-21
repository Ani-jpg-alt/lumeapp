import React, { useState, useEffect } from 'react';

const PopupNotification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, #4CAF50, #8BC34A)';
      case 'error':
        return 'linear-gradient(135deg, #f44336, #FF5722)';
      case 'info':
        return 'linear-gradient(135deg, #2196F3, #03A9F4)';
      case 'warning':
        return 'linear-gradient(135deg, #FF9800, #FFC107)';
      default:
        return 'linear-gradient(135deg, #e91e63, #f8e8ff)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: getBackgroundColor(),
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minWidth: '300px',
      maxWidth: '400px',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem'
      }}>
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
        {type === 'warning' && '⚠'}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          margin: 0,
          fontSize: '0.95rem',
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          {message}
        </p>
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
      >
        ×
      </button>
    </div>
  );
};

export default PopupNotification;