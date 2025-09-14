import React from 'react';

function Privacy() {
  return (
    <div className="section">
      <div className="container">
        <h1>Privacy Policy</h1>
        
        <div style={{maxWidth: '700px', margin: '0 auto'}}>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '2rem'}}>
            Effective Date: January 1, 2024
          </p>

          <div style={{background: '#f8e8ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem'}}>
            <p style={{fontSize: '0.9rem', margin: 0, fontWeight: '500'}}>
              At Lume by Lee, we respect your privacy and are committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA).
            </p>
          </div>

          <section style={{marginBottom: '2rem'}}>
            <h3>What Information Do We Collect?</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem'}}>
              When you shop with us, we collect:
            </p>
            <ul style={{fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.5rem'}}>
              <li>Personal details (name, email, phone number)</li>
              <li>Delivery and billing addresses</li>
              <li>Payment information (processed securely)</li>
              <li>Order history and preferences</li>
              <li>Website usage data through cookies</li>
            </ul>
          </section>

          <section style={{marginBottom: '2rem'}}>
            <h3>How Do We Use Your Information?</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6'}}>
              We use your information to process orders, arrange delivery, provide customer service, improve our website, and send you promotional offers (only if you've opted in). We may also use it for fraud prevention and legal compliance.
            </p>
          </section>

          <section style={{marginBottom: '2rem'}}>
            <h3>Who Do We Share Your Information With?</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6'}}>
              We only share your information with trusted service providers including delivery partners (PEP, The Courier Guy), payment processors, and IT service providers. We never sell your personal information to third parties.
            </p>
          </section>

          <section style={{marginBottom: '2rem'}}>
            <h3>Your Rights Under POPIA</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem'}}>
              You have the right to:
            </p>
            <ul style={{fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '1.5rem'}}>
              <li>Access your personal information</li>
              <li>Correct or update your details</li>
              <li>Delete your information (subject to legal requirements)</li>
              <li>Object to processing for marketing purposes</li>
              <li>Lodge a complaint with the Information Regulator</li>
            </ul>
          </section>

          <section style={{marginBottom: '2rem'}}>
            <h3>Data Security & Retention</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6'}}>
              We implement appropriate technical and organizational measures to protect your information. Your data is stored securely in South Africa and retained only as long as necessary for business and legal purposes.
            </p>
          </section>

          <section style={{marginBottom: '2rem'}}>
            <h3>Cookies & Website Analytics</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6'}}>
              Our website uses cookies to enhance your shopping experience and analyze website performance. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <div style={{background: '#e91e63', color: 'white', padding: '1.5rem', borderRadius: '8px', textAlign: 'center'}}>
            <h4 style={{margin: '0 0 0.5rem 0'}}>Contact Our Privacy Officer</h4>
            <p style={{margin: 0, fontSize: '0.9rem'}}>Email: privacy@lumebylee.co.za | Phone: Available on request</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;