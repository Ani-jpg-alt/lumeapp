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

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'white',
          color: '#e91e63',
          border: '2px solid #e91e63'
        };
      case 'error':
        return {
          background: 'white',
          color: '#f44336',
          border: '2px solid #f44336'
        };
      case 'info':
        return {
          background: 'white',
          color: '#2196F3',
          border: '2px solid #2196F3'
        };
      case 'warning':
        return {
          background: 'white',
          color: '#FF9800',
          border: '2px solid #FF9800'
        };
      default:
        return {
          background: 'white',
          color: '#e91e63',
          border: '2px solid #e91e63'
        };
    }
  };

  const styles = getStyles();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: styles.background,
      color: styles.color,
      border: styles.border,
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minWidth: '300px',
      maxWidth: '400px',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }}>
      <div style={{
        background: styles.color,
        color: 'white',
        borderRadius: '50%',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        minWidth: '32px',
        minHeight: '32px'
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
          fontWeight: '600',
          lineHeight: '1.4'
        }}>
          {message}
        </p>
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'transparent',
          border: `1px solid ${styles.color}`,
          color: styles.color,
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = styles.color;
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = styles.color;
        }}
      >
        ×
      </button>
    </div>
  );
};

export default PopupNotification;