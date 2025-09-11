import React from 'react';

function About() {
  return (
    <div className="section">
      <div className="container">
        <h1>Our Story 🌸</h1>
        
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          {/* Lihle's Story */}
          <section style={{marginBottom: '3rem'}}>
            <h2>Lihle's Journey ✨</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              Hey beautiful! I'm Lihle, and this brand was born from pure love and a dream to make 
              every woman feel absolutely radiant. In 2023, I noticed something missing - where were 
              the dreamy, flowing dresses in those gorgeous nude tones that make your skin glow? 
              The kind that make you feel like you're floating through a spring garden? 🌿
            </p>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              So I created exactly that! Every piece in our collection is chosen with so much love, 
              designed to make you feel confident, joyful, and absolutely stunning. Because you 
              deserve to feel like the goddess you are, every single day! 💕
            </p>
          </section>

          {/* Brand Mission */}
          <section style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px'}}>
            <h2>Our Mission 🌟</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              We're here to sprinkle a little magic into your wardrobe! Our mission is simple: 
              create pieces that make you smile every time you put them on. We believe fashion 
              should be joyful, effortless, and make you feel like the amazing person you are.
            </p>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>
              What we're all about:
            </p>
            <ul style={{fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>🌿 Sustainable fashion that loves our planet</li>
              <li>✨ Celebrating those dreamy nude tones that make you glow</li>
              <li>💕 Creating a community of confident, radiant women</li>
              <li>🌸 Timeless pieces that grow with your journey</li>
              <li>🌟 Making every day feel a little more magical</li>
            </ul>
          </section>

          {/* Values */}
          <section style={{marginTop: '3rem'}}>
            <h2>What We Stand For 🌈</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem'}}>
              <div style={{textAlign: 'center', padding: '2rem', background: 'rgba(245, 245, 220, 0.3)', borderRadius: '20px'}}>
                <h3 style={{color: '#D2B48C', marginBottom: '1rem'}}>✨ Pure Quality</h3>
                <p>Every thread, every stitch is chosen with love. We work with amazing artisans who share our passion for creating something truly special.</p>
              </div>
              <div style={{textAlign: 'center', padding: '2rem', background: 'rgba(245, 245, 220, 0.3)', borderRadius: '20px'}}>
                <h3 style={{color: '#D2B48C', marginBottom: '1rem'}}>🌿 Earth Love</h3>
                <p>Fashion should make the world more beautiful, not less. We're committed to sustainable practices that honor our gorgeous planet.</p>
              </div>
              <div style={{textAlign: 'center', padding: '2rem', background: 'rgba(245, 245, 220, 0.3)', borderRadius: '20px'}}>
                <h3 style={{color: '#D2B48C', marginBottom: '1rem'}}>💕 All Bodies Beautiful</h3>
                <p>Every woman deserves to feel absolutely stunning. Our designs celebrate the unique beauty in all of us.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;