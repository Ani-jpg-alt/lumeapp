import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/firestoreService';
import { useYocoPopup, createYocoPayment, createYocoPaymentIntent, YOCO_TEST_CARDS } from '../services/yocoService';
import { useNotification } from '../contexts/NotificationContext';

export default function Checkout({ product, cartItems, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [orderId, setOrderId] = useState(null);
  const { showPopup, isYocoReady } = useYocoPopup();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    gateway: 'payfast'
  });
  
  // Determine if this is a single product checkout or cart checkout
  const isCartCheckout = cartItems && cartItems.length > 0;
  const items = isCartCheckout ? cartItems : (product ? [product] : []);

  // Security check: Ensure user is authenticated
  if (!currentUser) {
    return (
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
          <h2 style={{ color: '#c62828', marginBottom: '1rem' }}>Authentication Required</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            You must be logged in to proceed with checkout.
          </p>
          <button
            onClick={onClose}
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
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Security checks
    if (!currentUser) {
      setError('You must be logged in to complete this purchase.');
      setLoading(false);
      return;
    }

    if (!items || items.length === 0) {
      setError('No items to checkout. Please add items to your cart first.');
      setLoading(false);
      return;
    }

    try {
      // Calculate total amount
      const totalAmount = items.reduce((total, item) => {
        const price = parseFloat(item.price.replace('R', ''));
        const quantity = item.quantity || 1;
        return total + (price * quantity);
      }, 0);

    if (totalAmount <= 0) {
      setError('Invalid order total. Please try again.');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError('Please enter your phone number.');
      setLoading(false);
      return;
    }

    if (!formData.address.trim()) {
      setError('Please enter your delivery address.');
      setLoading(false);
      return;
    }

    if (!formData.city.trim()) {
      setError('Please enter your city.');
      setLoading(false);
      return;
    }

    if (!formData.postalCode.trim()) {
      setError('Please enter your postal code.');
      setLoading(false);
      return;
    }

      // Create order in Firestore
      const newOrderId = await createOrder({
        userId: currentUser.uid,
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          productPrice: item.price,
          quantity: item.quantity || 1,
          selectedSize: item.selectedSize
        })),
        totalAmount: totalAmount,
        gateway: formData.gateway,
        deliveryDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        }
      });

      setOrderId(newOrderId);

      // Redirect to payment gateway
      if (formData.gateway === 'payfast') {
        redirectToPayFast(newOrderId, items, formData, totalAmount);
      } else if (formData.gateway === 'yoco') {
        redirectToYoco(newOrderId, items, formData, totalAmount);
      }

    } catch (error) {
      setError('Failed to create order. Please try again.');
      console.error('Checkout error:', error);
    }

    setLoading(false);
  };

  const redirectToPayFast = (orderId, items, deliveryDetails, totalAmount) => {
    // PayFast sandbox parameters
    const itemNames = items.map(item => item.name).join(', ');
    const payfastParams = {
      merchant_id: '10000100', // Sandbox merchant ID
      merchant_key: '46f0cd694581a', // Sandbox merchant key
      return_url: `${window.location.origin}/order-success/${orderId}`,
      cancel_url: `${window.location.origin}/cart`,
      notify_url: `${window.location.origin}/api/payfast-notify`, // You'll need to implement this
      name_first: deliveryDetails.name.split(' ')[0],
      name_last: deliveryDetails.name.split(' ').slice(1).join(' '),
      email_address: deliveryDetails.email,
      cell_number: deliveryDetails.phone,
      m_payment_id: orderId,
      amount: totalAmount,
      item_name: isCartCheckout ? `Order - ${items.length} items` : items[0].name,
      item_description: `Order for ${itemNames}`,
      custom_str1: currentUser.uid
    };

    // Build query string
    const queryString = Object.keys(payfastParams)
      .map(key => `${key}=${encodeURIComponent(payfastParams[key])}`)
      .join('&');

    // Redirect to PayFast sandbox
    window.location.href = `https://sandbox.payfast.co.za/eng/process?${queryString}`;
  };

  const redirectToYoco = async (orderId, items, deliveryDetails, totalAmount) => {
    try {
      showNotification('Creating Yoco payment...', 'info');
      setError('Creating payment...');

      // Create payment intent with backend server
      const paymentIntent = await createYocoPaymentIntent(orderId, items, deliveryDetails, totalAmount);

      if (paymentIntent.redirectUrl) {
        showNotification('Redirecting to Yoco...', 'info');

        // Close modal before redirecting
        if (onClose) {
          onClose();
        }

        // Small delay to show notification
        setTimeout(() => {
          // Redirect to Yoco's hosted payment page
          console.log('Redirecting to Yoco:', paymentIntent.redirectUrl);
          window.location.href = paymentIntent.redirectUrl;
        }, 500);
      } else {
        throw new Error('No redirect URL received from payment intent');
      }

    } catch (error) {
      console.error('Error initiating Yoco payment:', error);
      setError('Failed to initiate payment: ' + error.message);
      showNotification('Failed to create payment. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
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
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#e91e63', margin: 0 }}>Checkout</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {/* Order Summary */}
        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Order Summary</h3>
          
          {items.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: index < items.length - 1 ? '1rem' : '0',
              paddingBottom: index < items.length - 1 ? '1rem' : '0',
              borderBottom: index < items.length - 1 ? '1px solid #e0e0e0' : 'none'
            }}>
              <img 
                src={item.imageUrl || item.image} 
                alt={item.name}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, color: '#e91e63' }}>{item.name}</h4>
                {item.selectedSize && (
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                    Size: {item.selectedSize}
                  </p>
                )}
                <p style={{ margin: 0, fontSize: '1rem', color: '#333' }}>
                  {item.quantity || 1} × {item.price}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#e91e63' }}>
                  R{((item.quantity || 1) * parseFloat(item.price.replace('R', ''))).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          
          <hr style={{ border: '1px solid #e0e0e0', margin: '1rem 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: '#333' }}>Total</h4>
            <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#e91e63' }}>
              R{items.reduce((total, item) => {
                const price = parseFloat(item.price.replace('R', ''));
                const quantity = item.quantity || 1;
                return total + (price * quantity);
              }, 0).toFixed(2)}
            </h4>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>Delivery Details</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <h3 style={{ color: '#333', marginBottom: '1rem' }}>Payment Method</h3>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="radio"
                name="gateway"
                value="payfast"
                checked={formData.gateway === 'payfast'}
                onChange={handleInputChange}
              />
              <span>PayFast (Sandbox)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="gateway"
                value="yoco"
                checked={formData.gateway === 'yoco'}
                onChange={handleInputChange}
              />
              <span>Yoco (Sandbox) {!isYocoReady && '- Loading...'}</span>
            </label>
          </div>

          {formData.gateway === 'yoco' && (
            <div style={{
              background: '#e3f2fd',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #bbdefb'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Yoco Sandbox Simulation</h4>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#333' }}>
                This will simulate a Yoco payment for testing purposes. The payment will be automatically approved in sandbox mode.
              </p>
              <div style={{ fontSize: '0.8rem', color: '#555' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  ✅ <strong>Automatic approval</strong> - Payment will be simulated as successful
                </div>
                <div style={{ marginBottom: '0.25rem' }}>
                  🔄 <strong>Processing time</strong> - 2 second simulation delay
                </div>
                <div>
                  📧 <strong>Order confirmation</strong> - You'll be redirected to the success page
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #e91e63, #f8e8ff)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : `Pay R${items.reduce((total, item) => {
              const price = parseFloat(item.price.replace('R', ''));
              const quantity = item.quantity || 1;
              return total + (price * quantity);
            }, 0).toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
