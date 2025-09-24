import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/firestoreService';
import { createYocoPaymentIntent, YOCO_TEST_CARDS } from '../services/yocoService';

export default function Checkout() {
  const { currentUser } = useAuth();
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    gateway: 'yoco'
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [currentUser, cartItems, navigate]);

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

    if (!currentUser) {
      setError('You must be logged in to complete this purchase.');
      setLoading(false);
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('No items to checkout. Please add items to your cart first.');
      setLoading(false);
      return;
    }

    try {
      const totalAmount = getTotalPrice();

      if (totalAmount <= 0) {
        setError('Invalid order total. Please try again.');
        setLoading(false);
        return;
      }

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

      const orderId = await createOrder({
        userId: currentUser.uid,
        items: cartItems.map(item => ({
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

      if (formData.gateway === 'payfast') {
        redirectToPayFast(orderId, cartItems, formData, totalAmount);
      } else if (formData.gateway === 'yoco') {
        redirectToYoco(orderId, cartItems, formData, totalAmount);
      }

    } catch (error) {
      setError('Failed to create order. Please try again.');
      console.error('Checkout error:', error);
    }

    setLoading(false);
  };

  const redirectToPayFast = (orderId, items, deliveryDetails, totalAmount) => {
    const itemNames = items.map(item => item.name).join(', ');
    const payfastParams = {
      merchant_id: '10000100',
      merchant_key: '46f0cd694581a',
      return_url: `${window.location.origin}/order-success/${orderId}`,
      cancel_url: `${window.location.origin}/cart`,
      notify_url: `${window.location.origin}/api/payfast-notify`,
      name_first: deliveryDetails.name.split(' ')[0],
      name_last: deliveryDetails.name.split(' ').slice(1).join(' '),
      email_address: deliveryDetails.email,
      cell_number: deliveryDetails.phone,
      m_payment_id: orderId,
      amount: totalAmount,
      item_name: `Order - ${items.length} items`,
      item_description: `Order for ${itemNames}`,
      custom_str1: currentUser.uid
    };

    const queryString = Object.keys(payfastParams)
      .map(key => `${key}=${encodeURIComponent(payfastParams[key])}`)
      .join('&');

    window.location.href = `https://sandbox.payfast.co.za/eng/process?${queryString}`;
  };

  const redirectToYoco = async (orderId, items, deliveryDetails, totalAmount) => {
    try {
      setError('Creating Yoco payment...');

      // Create payment intent with backend server
      const paymentIntent = await createYocoPaymentIntent(orderId, items, deliveryDetails, totalAmount);

      if (paymentIntent.redirectUrl) {
        // Clear cart before redirecting to payment
        await clearCart();

        // Redirect to Yoco's hosted payment page
        console.log('Redirecting to Yoco:', paymentIntent.redirectUrl);
        window.location.href = paymentIntent.redirectUrl;
      } else {
        throw new Error('No redirect URL received from payment intent');
      }

    } catch (error) {
      console.error('Error initiating Yoco payment:', error);
      setError('Failed to initiate payment: ' + error.message);
      setLoading(false);
    }
  };

  if (!currentUser || !cartItems || cartItems.length === 0) {
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
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{ color: '#e91e63', margin: 0 }}>Checkout</h1>
            <button
              onClick={() => navigate('/cart')}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#e91e63',
                border: '2px solid #e91e63',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Back to Cart
            </button>
          </div>

          <div className="checkout-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            gap: '2rem'
          }}>
            <div>
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
                  {/* <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                      type="radio"
                      name="gateway"
                      value="payfast"
                      checked={formData.gateway === 'payfast'}
                      onChange={handleInputChange}
                    />
                    <span>PayFast (Sandbox)</span>
                  </label> */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="gateway"
                      value="yoco"
                      checked={formData.gateway === 'yoco'}
                      onChange={handleInputChange}
                    />
                    <span>Yoco (Sandbox)</span>
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
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Yoco Sandbox Test Cards</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#333' }}>
                      Use these test card numbers in the payment modal:
                    </p>
                    <div style={{ fontSize: '0.8rem', color: '#555' }}>
                      <div style={{ marginBottom: '0.25rem' }}>
                        <strong>Visa:</strong> {YOCO_TEST_CARDS.visa.number} (Success)
                      </div>
                      <div style={{ marginBottom: '0.25rem' }}>
                        <strong>Mastercard:</strong> {YOCO_TEST_CARDS.mastercard.number} (Success)
                      </div>
                      <div>
                        <strong>Declined:</strong> {YOCO_TEST_CARDS.declined.number} (Will be declined)
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
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
{loading ? (
                    <>
                      <span>Redirecting</span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          animation: 'dot1 1.4s infinite ease-in-out both'
                        }}></div>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          animation: 'dot2 1.4s infinite ease-in-out both'
                        }}></div>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          animation: 'dot3 1.4s infinite ease-in-out both'
                        }}></div>
                      </div>
                    </>
                  ) : (
                    `Pay R${getTotalPrice().toFixed(2)}`
                  )}
                </button>
              </form>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '2rem',
              borderRadius: '10px',
              height: 'fit-content'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Order Summary</h3>

              {cartItems.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: index < cartItems.length - 1 ? '1rem' : '0',
                  paddingBottom: index < cartItems.length - 1 ? '1rem' : '0',
                  borderBottom: index < cartItems.length - 1 ? '1px solid #e0e0e0' : 'none'
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
                  R{getTotalPrice().toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dot1 {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes dot2 {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes dot3 {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        [style*="animation: dot2"] {
          animation-delay: -1.1s !important;
        }

        [style*="animation: dot3"] {
          animation-delay: -0.9s !important;
        }
      `}</style>
    </div>
  );
}