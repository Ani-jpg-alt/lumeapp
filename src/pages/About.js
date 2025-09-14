import React from 'react';

function About() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(248,232,255,0.9), rgba(212,187,255,0.8)), url("https://images.unsplash.com/photo-1494790108755-2616c9c0e8e3?w=1200&h=600&fit=crop&auto=format&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 0 4rem',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{fontSize: '3.5rem', color: '#333', textShadow: '2px 2px 4px rgba(255,255,255,0.8)', marginBottom: '1rem'}}>A Dream Reignited</h1>
          <p style={{fontSize: '1.3rem', color: '#555', maxWidth: '600px', margin: '0 auto'}}>Meet the woman behind Lume by Lee</p>
        </div>
      </section>

      <div className="section">
        <div className="container">
          <div style={{maxWidth: '900px', margin: '0 auto'}}>
            
            {/* Founder Introduction */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem', textAlign: 'center'}}>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{
                  width: '250px',
                  height: '250px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e91e63, #f8e8ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(233, 30, 99, 0.3)'
                }}>
                  L
                </div>
              </div>
              <div>
                <h2 style={{fontSize: '2.5rem', marginBottom: '1rem', color: '#e91e63'}}>Langelihle Mpanza</h2>
                <p style={{fontSize: '1.2rem', color: '#666', marginBottom: '1rem'}}>Founder & Creative Director</p>
              </div>
            </div>

            {/* Story Cards */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem'}}>
              <div style={{background: 'linear-gradient(135deg, #f8e8ff, #e8d5ff)', padding: '2rem', borderRadius: '15px', textAlign: 'center'}}>

                <h3 style={{color: '#e91e63', marginBottom: '1rem'}}>The Dream</h3>
                <p style={{fontSize: '0.9rem', lineHeight: '1.6', color: '#555'}}>
                  Always dreamed of working with iconic fashion brands that celebrate and empower women through bold, stylish pieces.
                </p>
              </div>
              
              <div style={{background: 'linear-gradient(135deg, #fff0f5, #f8e8ff)', padding: '2rem', borderRadius: '15px', textAlign: 'center'}}>

                <h3 style={{color: '#e91e63', marginBottom: '1rem'}}>The Passion</h3>
                <p style={{fontSize: '0.9rem', lineHeight: '1.6', color: '#555'}}>
                  Life happened and I lost touch with fashion. But dreams have a beautiful way of calling us back, louder and stronger.
                </p>
              </div>
              
              <div style={{background: 'linear-gradient(135deg, #f0f8ff, #e8f4ff)', padding: '2rem', borderRadius: '15px', textAlign: 'center'}}>

                <h3 style={{color: '#e91e63', marginBottom: '1rem'}}>The Purpose</h3>
                <p style={{fontSize: '0.9rem', lineHeight: '1.6', color: '#555'}}>
                  Turning passion into purpose with Lume by Lee - confidence, energy, and glow for the modern woman.
                </p>
              </div>
            </div>

            {/* Main Story */}
            <section style={{background: 'linear-gradient(135deg, #f8e8ff 0%, #e8d5ff 100%)', padding: '3rem', borderRadius: '20px', marginBottom: '3rem', boxShadow: '0 10px 30px rgba(233, 30, 99, 0.1)'}}>
              <div style={{fontSize: '1.1rem', lineHeight: '1.8', color: '#2D2D2D'}}>
                <p style={{marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '500', color: '#e91e63'}}>
                  "I saw a gap - not just in the market, but in my own heart - and decided it was time to fill it."
                </p>
                
                <p style={{marginBottom: '1.5rem'}}>
                  <strong>Lume is all about confidence, energy, and glow.</strong> We're kicking things off with hot summer essentials and gym wear — curated for the modern woman who knows what she wants and owns her shine.
                </p>
                
                <p style={{marginBottom: '1.5rem'}}>
                  From beach days to gym sessions, this is for <strong>YOU</strong>. It's summer, and we're taking it into our own hands.
                </p>
                
                <p style={{marginBottom: '2rem'}}>
                  Thank you for being part of this journey. Here's to rediscovering dreams, showing up boldly, and looking absolutely stunning while doing it.
                </p>
                
                <div style={{textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.5)', borderRadius: '15px'}}>
                  <p style={{fontSize: '1.1rem', fontWeight: '600', color: '#e91e63', marginBottom: '0.5rem'}}>With love & light,</p>
                  <p style={{fontSize: '1.3rem', fontWeight: '700', color: '#333'}}>Langelihle Mpanza</p>
                  <p style={{fontSize: '0.9rem', color: '#666'}}>Founder, Lume by Lee</p>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <div style={{textAlign: 'center', padding: '2rem'}}>
              <h3 style={{marginBottom: '1rem', color: '#e91e63'}}>Ready to Glow?</h3>
              <a href="/shop" className="btn" style={{fontSize: '1.1rem', padding: '15px 30px'}}>Shop the Collection</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;