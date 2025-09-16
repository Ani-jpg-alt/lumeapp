import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, updateOrderStatus } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrder(orderId);
        
        // Security check: Ensure the order belongs to the current user
        if (orderData.userId !== currentUser?.uid) {
          setError('Access denied. This order does not belong to you.');
          setLoading(false);
          return;
        }
        
        setOrder(orderData);
        
        // Simulate payment success and update order status
        // In a real app, this would be handled by webhook callbacks
        if (orderData.status === 'pending') {
          setTimeout(async () => {
            try {
              await updateOrderStatus(orderId, 'paid');
              setOrder(prev => ({ ...prev, status: 'paid' }));
            } catch (error) {
              console.error('Error updating order status:', error);
            }
          }, 2000);
        }
      } catch (error) {
        setError('Order not found');
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && currentUser) {
      fetchOrder();
    } else if (!currentUser) {
      setError('You must be logged in to view this order.');
      setLoading(false);
    }
  }, [orderId, currentUser]);

  if (loading) {
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
          <p style={{ color: '#e91e63', fontSize: '1.2rem' }}>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8e8ff, #e8d5ff)',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#c62828', marginBottom: '1rem' }}>Order Not Found</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            We couldn't find the order you're looking for.
          </p>
          <button
            onClick={() => navigate('/shop')}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #e91e63, #f8e8ff)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Back to Shop
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
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Success Header */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '20px',
          textAlign: 'center',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #4caf50, #8bc34a)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem',
            color: 'white'
          }}>
            ✓
          </div>
          <h1 style={{ color: '#e91e63', marginBottom: '0.5rem' }}>
            {order.status === 'paid' ? 'Payment Successful!' : 'Order Received!'}
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            {order.status === 'paid' 
              ? 'Your payment has been processed successfully.' 
              : 'Your order is being processed. Payment confirmation pending...'
            }
          </p>
        </div>

        {/* Order Details */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#e91e63', marginBottom: '1.5rem' }}>Order Details</h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Order Information</h3>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ margin: '0.25rem 0' }}><strong>Order ID:</strong> {order.id}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Status:</strong> 
                  <span style={{
                    color: order.status === 'paid' ? '#4caf50' : '#ff9800',
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </p>
                <p style={{ margin: '0.25rem 0' }}><strong>Date:</strong> {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Payment Method:</strong> {order.gateway.toUpperCase()}</p>
              </div>
            </div>

            <div>
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Products</h3>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                {order.items ? (
                  order.items.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      marginBottom: index < order.items.length - 1 ? '1rem' : '0',
                      paddingBottom: index < order.items.length - 1 ? '1rem' : '0',
                      borderBottom: index < order.items.length - 1 ? '1px solid #e0e0e0' : 'none'
                    }}>
                      <img 
                        src={item.productName === 'Jean Dress' ? '/jean-dress.JPG' : 
                             item.productName === 'Polka Dot Dress' ? '/polka-dot-dress.JPG' : 
                             '/two-piece.JPG'} 
                        alt={item.productName}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, color: '#e91e63' }}>{item.productName}</h4>
                        {item.selectedSize && (
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                            Size: {item.selectedSize}
                          </p>
                        )}
                        <p style={{ margin: 0, fontSize: '1rem', color: '#333' }}>
                          {item.quantity} × {item.productPrice}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#e91e63' }}>
                          R{(item.quantity * parseFloat(item.productPrice.replace('R', ''))).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback for old single product format
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={order.productName === 'Jean Dress' ? '/jean-dress.JPG' : 
                           order.productName === 'Polka Dot Dress' ? '/polka-dot-dress.JPG' : 
                           '/two-piece.JPG'} 
                      alt={order.productName}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div>
                      <h4 style={{ margin: 0, color: '#e91e63' }}>{order.productName}</h4>
                      <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#e91e63' }}>
                        R{order.amount}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Delivery Details</h3>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {order.deliveryDetails.name}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {order.deliveryDetails.email}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Phone:</strong> {order.deliveryDetails.phone}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Address:</strong> {order.deliveryDetails.address}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>City:</strong> {order.deliveryDetails.city}</p>
                <p style={{ margin: '0.25rem 0' }}><strong>Postal Code:</strong> {order.deliveryDetails.postalCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/shop')}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #e91e63, #f8e8ff)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: '0.75rem 2rem',
              background: 'white',
              color: '#e91e63',
              border: '2px solid #e91e63',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Print Receipt
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
