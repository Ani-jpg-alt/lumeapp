import React from 'react';

function Terms() {
  return (
    <div className="section">
      <div className="container">
        <h1>Terms & Conditions</h1>
        
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          <p style={{fontSize: '0.9rem', color: '#999', marginBottom: '2rem'}}>
            Last updated: January 1, 2024
          </p>

          <section style={{marginBottom: '2rem'}}>
            <h3>Agreement</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6'}}>
              By using this website, you agree to these terms. Lume by Lee complies with South African Consumer Protection Act (CPA) and POPIA.
            </p>
          </section>

          <section style={{marginBottom: '2rem'}}>
            <h3>Pricing & Payment</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6'}}>
              Prices in ZAR include VAT. Payment required before dispatch. 5-7 day delivery via PEP/Courier Guy.
            </p>
          </section>

          <section style={{marginBottom: '2rem'}}>
            <h3>Returns Policy</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6'}}>
              Size exchanges only within 7 days. No refunds. Items must be unworn with tags. Customer pays return shipping.
            </p>
          </section>

          <section style={{marginBottom: '2rem'}}>
            <h3>Liability & Law</h3>
            <p style={{fontSize: '0.9rem', lineHeight: '1.6'}}>
              Governed by South African law. Liability limited to purchase price. Disputes via SA courts or National Consumer Commission.
            </p>
          </section>

          <div style={{textAlign: 'center', padding: '1.5rem', background: '#f8e8ff', borderRadius: '8px'}}>
            <p style={{fontSize: '0.9rem', margin: 0}}>Questions? Contact privacy@lumebylee.co.za</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;