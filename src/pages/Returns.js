import React from 'react';

function Returns() {
  return (
    <div className="section">
      <div className="container">
        <h1>Returns Policy</h1>
        
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <section style={{marginBottom: '3rem'}}>
            <h2>30-Day Return Policy</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We want you to love your Nudes purchase! If you're not completely satisfied, 
              you can return your item within 30 days of delivery for a full refund.
            </p>
          </section>

          <section style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px', marginBottom: '3rem'}}>
            <h2>Return Requirements</h2>
            <ul style={{fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>Items must be returned within 30 days of delivery</li>
              <li>Items must be unworn, unwashed, and in original condition</li>
              <li>All original tags must be attached</li>
              <li>Items must be in original packaging when possible</li>
              <li>Sale items are final sale and cannot be returned</li>
            </ul>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>How to Return</h2>
            <ol style={{fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>Contact our customer service team at hello@nudes.com</li>
              <li>Include your order number and reason for return</li>
              <li>We'll send you a prepaid return label within 24 hours</li>
              <li>Package your item securely and attach the return label</li>
              <li>Drop off at any authorized shipping location</li>
            </ol>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Exchanges</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              Need a different size or color? We offer free exchanges within 30 days. 
              Simply follow the return process above and let us know what you'd like to exchange for.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Refund Timeline</h2>
            <ul style={{fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>We process returns within 3-5 business days of receiving your item</li>
              <li>Refunds are issued to your original payment method</li>
              <li>Credit card refunds typically appear within 5-7 business days</li>
              <li>PayPal refunds are usually instant</li>
            </ul>
          </section>

          <div style={{textAlign: 'center', padding: '2rem', background: '#F5F5DC', borderRadius: '10px'}}>
            <h3>Questions about returns?</h3>
            <p>Contact us at hello@nudes.com or call +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Returns;