import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';
import { paymentWebhookService } from '../services/paymentWebhookService';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState({
    verified: false,
    status: 'pending',
    attempts: 0,
    lastAttempt: null
  });

  useEffect(() => {
    const verifyPaymentAndFetchOrder = async () => {
      try {
        // console.log(`🔍 Starting secure payment verification for order: ${orderId}`);

        // 1. First get the order from local database
        const orderData = await getOrder(orderId);

        // 2. Security check: Ensure the order belongs to the current user
        if (orderData.userId !== currentUser?.uid) {
          setError('Access denied. This order does not belong to you.');
          setLoading(false);
          return;
        }

        setOrder(orderData);
        // console.log(`📋 Order loaded. Current status: ${orderData.status}`);

        // 3. Verify payment status with server (this is the secure part!)
        // console.log('🔐 Verifying payment with server...');
        setVerificationStatus(prev => ({
          ...prev,
          attempts: prev.attempts + 1,
          lastAttempt: new Date()
        }));

        const verificationResult = await paymentWebhookService.verifyPaymentStatus(orderId);

        // console.log('✅ Payment verification result:', verificationResult);

        // 4. Update verification status
        setVerificationStatus({
          verified: verificationResult.verified,
          status: verificationResult.status,
          attempts: verificationStatus.attempts + 1,
          lastAttempt: new Date(),
          serverData: verificationResult.serverData
        });

        // 5. Update local order with verified status
        if (verificationResult.verified && verificationResult.status !== orderData.status) {
          // console.log(`🔄 Updating local order status: ${orderData.status} → ${verificationResult.status}`);
          setOrder(prev => ({
            ...prev,
            status: verificationResult.status,
            verifiedByWebhook: true,
            verificationTime: new Date()
          }));
        }

        // 6. If payment is still pending, start polling
        if (verificationResult.status === 'pending' && verificationResult.verified === false) {
          // console.log('⏳ Payment still pending, starting polling...');

          try {
            const pollingResult = await paymentWebhookService.pollPaymentStatus(orderId, 6, 5000);

            // console.log('🎉 Polling completed:', pollingResult);

            setVerificationStatus({
              verified: pollingResult.verified,
              status: pollingResult.status,
              attempts: verificationStatus.attempts + 6,
              lastAttempt: new Date(),
              serverData: pollingResult.serverData
            });

            setOrder(prev => ({
              ...prev,
              status: pollingResult.status,
              verifiedByWebhook: true,
              verificationTime: new Date()
            }));

          } catch (pollingError) {
            // console.error('⚠️ Payment polling failed:', pollingError);
            setVerificationStatus(prev => ({
              ...prev,
              error: 'Unable to confirm payment status'
            }));
          }
        }

      } catch (error) {
        // console.error('❌ Payment verification failed:', error);
        setError(`Unable to verify payment status. Please contact support if needed.`);
        setVerificationStatus(prev => ({
          ...prev,
          verified: false,
          error: 'Payment verification unavailable'
        }));
      } finally {
        setLoading(false);
      }
    };

    if (orderId && currentUser) {
      verifyPaymentAndFetchOrder();
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
            {verificationStatus.verified && verificationStatus.status === 'paid'
              ? 'Payment Successful!'
              : verificationStatus.status === 'failed'
                ? 'Payment Not Completed'
                : 'Confirming Your Payment...'
            }
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            {verificationStatus.verified && verificationStatus.status === 'paid'
              ? 'Thank you! Your payment has been processed successfully.'
              : verificationStatus.status === 'failed'
                ? 'Your payment could not be completed. Please try again or contact support.'
                : 'Please wait while we confirm your payment...'
            }
          </p>

          {/* Verification Status Indicator */}
          <div style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            background: verificationStatus.verified && verificationStatus.status === 'paid'
              ? '#e8f5e8'
              : verificationStatus.status === 'failed'
                ? '#ffeaea'
                : '#fff3cd',
            color: verificationStatus.verified && verificationStatus.status === 'paid'
              ? '#2e7d32'
              : verificationStatus.status === 'failed'
                ? '#c62828'
                : '#f57c00',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {verificationStatus.verified && verificationStatus.status === 'paid'
              ? '✅ Payment Confirmed'
              : verificationStatus.status === 'failed'
                ? '❌ Payment Failed'
                : '🔍 Confirming Payment...'
            }
            {verificationStatus.attempts > 0 && (
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                (Attempt {verificationStatus.attempts})
              </span>
            )}
          </div>
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
                    color: verificationStatus.status === 'paid' ? '#4caf50' :
                           verificationStatus.status === 'failed' ? '#f44336' : '#ff9800',
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {verificationStatus.status.toUpperCase()}
                    {verificationStatus.verified && verificationStatus.status === 'paid' ? ' ✓' : ''}
                  </span>
                </p>
                {verificationStatus.verified && (
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#4caf50' }}>
                    <strong>✅ Payment Confirmed:</strong> {verificationStatus.lastAttempt?.toLocaleTimeString()}
                  </p>
                )}
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
