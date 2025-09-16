import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Security check: Redirect to auth if not logged in
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  // Show loading while checking authentication
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8e8ff, #e8d5ff)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e91e63',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#e91e63', fontSize: '1.2rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  const handleQuantityChange = (productId, selectedSize, newQuantity) => {
    updateQuantity(productId, selectedSize, parseInt(newQuantity));
  };

  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8e8ff, #e8d5ff)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #e91e63, #f8e8ff)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            fontSize: '3rem',
            color: 'white'
          }}>
            🛒
          </div>
          <h2 style={{ color: '#e91e63', marginBottom: '1rem' }}>Your Cart is Empty</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            onClick={() => navigate('/shop')}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #e91e63, #f8e8ff)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8e8ff, #e8d5ff)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h1 style={{ color: '#e91e63', margin: 0 }}>Shopping Cart</h1>
            <button
              onClick={clearCart}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#e91e63',
                border: '2px solid #e91e63',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Clear Cart
            </button>
          </div>
          <p style={{ color: '#666', margin: 0 }}>
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="cart-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2rem'
        }}>
          {/* Cart Items */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#e91e63', marginBottom: '1.5rem' }}>Items</h2>
            
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.selectedSize}-${index}`} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem 0',
                borderBottom: index < cartItems.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>{item.name}</h3>
                  {item.selectedSize && (
                    <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                      Size: {item.selectedSize}
                    </p>
                  )}
                  <p style={{ color: '#e91e63', margin: 0, fontWeight: 'bold' }}>
                    {item.price}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: '2px solid #e91e63',
                      background: 'white',
                      color: '#e91e63',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    -
                  </button>
                  
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, item.selectedSize, e.target.value)}
                    min="1"
                    style={{
                      width: '60px',
                      textAlign: 'center',
                      padding: '0.5rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: '2px solid #e91e63',
                      background: 'white',
                      color: '#e91e63',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id, item.selectedSize)}
                  style={{
                    padding: '0.5rem',
                    background: 'transparent',
                    color: '#c62828',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{ color: '#e91e63', marginBottom: '1.5rem' }}>Order Summary</h2>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>R{getTotalPrice().toFixed(2)}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <span>Shipping</span>
              <span style={{ color: '#4caf50' }}>Free</span>
            </div>
            
            <hr style={{ border: '1px solid #f0f0f0', margin: '1rem 0' }} />
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              <span>Total</span>
              <span style={{ color: '#e91e63' }}>R{getTotalPrice().toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #e91e63, #f8e8ff)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              {currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>

            <button
              onClick={() => navigate('/shop')}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'transparent',
                color: '#e91e63',
                border: '2px solid #e91e63',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
