import React from 'react';

function Terms() {
  return (
    <div className="section">
      <div className="container">
        <h1>Terms & Conditions</h1>
        
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <p style={{fontSize: '0.9rem', color: '#999', marginBottom: '2rem'}}>
            Last updated: January 1, 2024
          </p>

          <section style={{marginBottom: '3rem'}}>
            <h2>Agreement to Terms</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              By accessing and using the Nudes website, you accept and agree to be bound by the 
              terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Use License</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              Permission is granted to temporarily download one copy of the materials on Nudes' 
              website for personal, non-commercial transitory viewing only. This is the grant of 
              a license, not a transfer of title, and under this license you may not:
            </p>
            <ul style={{fontSize: '1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Product Information</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We strive to provide accurate product descriptions and pricing. However, we do not 
              warrant that product descriptions or other content is accurate, complete, reliable, 
              current, or error-free. Colors may vary due to monitor settings and photography lighting.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Pricing and Payment</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              All prices are subject to change without notice. We reserve the right to refuse or 
              cancel any order for any reason. Payment must be received before shipment of goods.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Privacy Policy</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the website, to understand our practices.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Limitation of Liability</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              In no event shall Nudes or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising 
              out of the use or inability to use the materials on Nudes' website.
            </p>
          </section>

          <section style={{marginBottom: '3rem'}}>
            <h2>Governing Law</h2>
            <p style={{fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              These terms and conditions are governed by and construed in accordance with the laws 
              of New York and you irrevocably submit to the exclusive jurisdiction of the courts 
              in that State or location.
            </p>
          </section>

          <div style={{textAlign: 'center', padding: '2rem', background: '#F5F5DC', borderRadius: '10px'}}>
            <h3>Questions about our Terms?</h3>
            <p>Contact us at hello@nudes.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;