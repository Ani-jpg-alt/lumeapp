import React from 'react';

function Returns() {
  return (
    <div className="section">
      <div className="container">
        <h1>Returns Policy</h1>
        
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <section style={{marginBottom: '3rem'}}>
            <h2>30-Day Exchange Policy</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We want you to love your Lume purchase! If you're not completely satisfied, 
              you can exchange your item within 30 days of delivery. Please note: we offer exchanges only, no cash refunds.
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
              <li>Contact our customer service team at sales@lumebylee.co.za</li>
              <li>Include your order number and reason for return</li>
              <li>We'll send you a prepaid return label within 24 hours</li>
              <li>Package your item securely and attach the return label</li>
              <li>Drop off at any authorized shipping location</li>
            </ol>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Exchanges Only</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We offer exchanges for different sizes or colors within 30 days. 
              Simply follow the return process above and let us know what you'd like to exchange for. 
              <strong>Please note: No cash refunds are available.</strong>
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Exchange Timeline</h2>
            <ul style={{fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>We process exchanges within 3-5 business days of receiving your item</li>
              <li>Your new item will be shipped once we receive your return</li>
              <li>Exchange shipping is free within South Africa</li>
              <li>You'll receive tracking information once your exchange ships</li>
            </ul>
          </section>

          <div style={{textAlign: 'center', padding: '2rem', background: '#F5F5DC', borderRadius: '10px'}}>
            <h3>Questions about exchanges?</h3>
            <p>Contact us at sales@lumebylee.co.za or call 074 485 0947</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Returns;