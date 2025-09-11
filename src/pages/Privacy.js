import React from 'react';

function Privacy() {
  return (
    <div className="section">
      <div className="container">
        <h1>Privacy Policy</h1>
        
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <p style={{fontSize: '0.9rem', color: '#999', marginBottom: '2rem'}}>
            Last updated: January 1, 2024
          </p>

          <section style={{marginBottom: '3rem'}}>
            <h2>Information We Collect</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for support. This may include:
            </p>
            <ul style={{fontSize: '1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>Name and contact information</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information</li>
              <li>Order history and preferences</li>
              <li>Communications with customer service</li>
            </ul>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>How We Use Your Information</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We use the information we collect to:
            </p>
            <ul style={{fontSize: '1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders</li>
              <li>Provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Information Sharing</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except as described in this policy. We may share your information with:
            </p>
            <ul style={{fontSize: '1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>Service providers who assist with our operations</li>
              <li>Payment processors for transaction processing</li>
              <li>Shipping companies for order fulfillment</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Data Security</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Your Rights</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              You have the right to:
            </p>
            <ul style={{fontSize: '1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your personal information</li>
            </ul>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Cookies</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We use cookies and similar technologies to enhance your browsing experience, 
              analyze site traffic, and personalize content. You can control cookie settings 
              through your browser preferences.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Changes to This Policy</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "last updated" date.
            </p>
          </section>

          <div style={{textAlign: 'center', padding: '2rem', background: '#F5F5DC', borderRadius: '10px'}}>
            <h3>Privacy Questions?</h3>
            <p>Contact us at privacy@nudes.com or hello@nudes.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;