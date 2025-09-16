import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../services/firestoreService';

export default function Orders() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (error) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8e8ff, #e8d5ff)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
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
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h1 style={{ color: '#e91e63', margin: 0 }}>My Orders</h1>
            <button
              onClick={() => navigate('/shop')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #e91e63, #f8e8ff)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Continue Shopping
            </button>
          </div>
          <p style={{ color: '#666', margin: 0 }}>
            Track your order history and status
          </p>
        </div>

        {loading ? (
          <div style={{
            background: 'white',
            padding: '4rem 2rem',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #e91e63',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: '#e91e63', fontSize: '1.2rem' }}>Loading orders...</p>
          </div>
        ) : error ? (
          <div style={{
            background: 'white',
            padding: '4rem 2rem',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#c62828', marginBottom: '1rem' }}>Error Loading Orders</h3>
            <p style={{ color: '#666' }}>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '4rem 2rem',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
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
              📦
            </div>
            <h2 style={{ color: '#e91e63', marginBottom: '1rem' }}>No Orders Yet</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              You haven't placed any orders yet. Start shopping to see your order history here!
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
        ) : (
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            {orders.map((order) => (
              <div key={order.id} style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h3 style={{
                      color: '#e91e63',
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.2rem'
                    }}>
                      Order #{order.id.slice(-8)}
                    </h3>
                    <p style={{
                      color: '#666',
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      background: getStatusColor(order.status),
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {order.status}
                    </span>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#e91e63'
                    }}>
                      R{order.totalAmount?.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {order.items?.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: '#f8f9fa',
                      borderRadius: '10px'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#e0e0e0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        color: '#666'
                      }}>
                        IMG
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          margin: '0 0 0.25rem 0',
                          color: '#333',
                          fontSize: '1rem'
                        }}>
                          {item.productName}
                        </h4>
                        {item.selectedSize && (
                          <p style={{
                            margin: '0 0 0.25rem 0',
                            fontSize: '0.9rem',
                            color: '#666'
                          }}>
                            Size: {item.selectedSize}
                          </p>
                        )}
                        <p style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          color: '#666'
                        }}>
                          Quantity: {item.quantity} × {item.productPrice}
                        </p>
                      </div>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: '#e91e63'
                      }}>
                        R{(item.quantity * parseFloat(item.productPrice.replace('R', ''))).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {order.deliveryDetails && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: '#f8f9fa',
                    borderRadius: '10px'
                  }}>
                    <h4 style={{
                      margin: '0 0 0.5rem 0',
                      color: '#333',
                      fontSize: '1rem'
                    }}>
                      Delivery Details
                    </h4>
                    <p style={{
                      margin: '0.25rem 0',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      <strong>{order.deliveryDetails.name}</strong>
                    </p>
                    <p style={{
                      margin: '0.25rem 0',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      {order.deliveryDetails.address}
                    </p>
                    <p style={{
                      margin: '0.25rem 0',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      {order.deliveryDetails.city}, {order.deliveryDetails.postalCode}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}