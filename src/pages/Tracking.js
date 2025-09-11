import React, { useState } from 'react';

function Tracking() {
  const [trackingData, setTrackingData] = useState({
    orderNumber: '',
    email: ''
  });

  const handleChange = (e) => {
    setTrackingData({
      ...trackingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Tracking information would be displayed here. This is a demo.');
  };

  return (
    <div className="section">
      <div className="container">
        <h1>Track Your Order</h1>
        
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          <p style={{textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem'}}>
            Enter your order details below to track your package
          </p>

          <form onSubmit={handleSubmit} style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px', marginBottom: '3rem'}}>
            <div className="form-group">
              <label htmlFor="orderNumber">Order Number *</label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                value={trackingData.orderNumber}
                onChange={handleChange}
                placeholder="e.g., NU123456789"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={trackingData.email}
                onChange={handleChange}
                placeholder="Enter the email used for your order"
                required
              />
            </div>
            
            <button type="submit" className="btn" style={{width: '100%'}}>
              Track Order
            </button>
          </form>

          <div style={{textAlign: 'center', marginBottom: '3rem'}}>
            <h2>Need Help?</h2>
            <p style={{marginBottom: '1rem'}}>
              Can't find your order number? Check your email confirmation or contact our support team.
            </p>
            <p>
              <strong>Customer Service:</strong> hello@nudes.com | +1 (555) 123-4567
            </p>
          </div>

          <div style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px'}}>
            <h3>Tracking Information</h3>
            <ul style={{fontSize: '1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>Orders typically ship within 1-2 business days</li>
              <li>You'll receive tracking info via email once shipped</li>
              <li>Standard shipping: 3-5 business days</li>
              <li>Express shipping: 1-2 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracking;