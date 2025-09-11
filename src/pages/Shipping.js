import React from 'react';

function Shipping() {
  return (
    <div className="section">
      <div className="container">
        <h1>Shipping & Delivery</h1>
        
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <section style={{marginBottom: '3rem'}}>
            <h2>Shipping Options</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem'}}>
              <div style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px'}}>
                <h3 style={{color: '#D2B48C', marginBottom: '1rem'}}>Standard Shipping</h3>
                <p><strong>Cost:</strong> Free on orders over $75, $8.99 under $75</p>
                <p><strong>Delivery:</strong> 3-5 business days</p>
                <p><strong>Tracking:</strong> Included</p>
              </div>
              <div style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px'}}>
                <h3 style={{color: '#D2B48C', marginBottom: '1rem'}}>Express Shipping</h3>
                <p><strong>Cost:</strong> $19.99</p>
                <p><strong>Delivery:</strong> 1-2 business days</p>
                <p><strong>Tracking:</strong> Included</p>
              </div>
            </div>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Processing Time</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              All orders are processed within 1-2 business days (Monday-Friday, excluding holidays). 
              You'll receive a confirmation email with tracking information once your order ships.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Shipping Areas</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We currently ship to all 50 US states and Washington D.C. International shipping 
              will be available soon - sign up for our newsletter to be notified when it launches!
            </p>
          </section>

          <section style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px', marginBottom: '3rem'}}>
            <h2>Delivery Information</h2>
            <ul style={{fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>Packages are delivered Monday-Friday, 9AM-6PM</li>
              <li>Signature confirmation may be required for orders over $200</li>
              <li>We ship to PO Boxes and APO/FPO addresses</li>
              <li>Delivery to business addresses is available</li>
              <li>We cannot deliver to freight forwarders</li>
            </ul>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Order Tracking</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              Once your order ships, you'll receive an email with your tracking number. 
              You can also track your order on our website using your order number and email address.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Shipping Delays</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              While we strive to meet our delivery estimates, delays can occasionally occur due to:
            </p>
            <ul style={{fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>Weather conditions</li>
              <li>High shipping volumes during peak seasons</li>
              <li>Incorrect shipping addresses</li>
              <li>Carrier delays</li>
            </ul>
          </section>

          <div style={{textAlign: 'center', padding: '2rem', background: '#F5F5DC', borderRadius: '10px'}}>
            <h3>Shipping Questions?</h3>
            <p>Contact us at hello@nudes.com or call +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shipping;