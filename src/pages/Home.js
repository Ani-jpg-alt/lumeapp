import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const products = [
    { id: 1, name: 'Silk Midi Dress', price: 'R1,599', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 2, name: 'Linen Wrap Dress', price: 'R1,349', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 3, name: 'Cotton Sundress', price: 'R1,169', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 4, name: 'Chiffon Maxi', price: 'R1,699', image: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e8?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 5, name: 'Summer Slip Dress', price: 'R809', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 6, name: 'Boho Midi Dress', price: 'R989', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d24?w=400&h=500&fit=crop&auto=format&q=80' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>DRESS TO GLOW</h1>
          <p>Stunning dresses that make you feel unstoppable. Every piece tells your story.</p>
          <Link to="/shop" className="btn">SHOP NOW</Link>
        </div>
      </section>

      {/* Products */}
      <section className="section">
        <div className="container">
          <h2>Make A Statement This Summer</h2>
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div style={{
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    background: 'rgba(212, 187, 255, 0.9)', 
                    color: '#1a1a1a', 
                    padding: '8px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    NEW
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <button className="btn" style={{width: '100%', fontSize: '0.9rem', padding: '12px'}}>
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Energy Section */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, rgba(212, 187, 255, 0.1), rgba(248, 232, 255, 0.1))',
        borderRadius: '30px',
        margin: '3rem 0'
      }}>
        <div className="container">
          <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
            <h2>ENERGY & GLOW</h2>
            <p style={{
              fontSize: '1.3rem', 
              color: 'white', 
              lineHeight: '1.8', 
              fontWeight: '600',
              textShadow: '0 0 8px rgba(212, 187, 255, 0.4), 0 1px 2px rgba(0,0,0,0.5)',
              marginBottom: '2rem'
            }}>
              Lume is all about confidence, energy, and glow. We curate pieces that empower 
              the modern woman to own her shine and radiate unstoppable energy.
            </p>
            <Link to="/about" className="btn" style={{fontSize: '1.1rem', padding: '18px 40px'}}>
              DISCOVER MORE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;