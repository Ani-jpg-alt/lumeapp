import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const newArrivals = [
    { id: 1, name: 'Silk Midi Dress', price: 'R1,599', image: 'Silk Midi Dress' },
    { id: 2, name: 'Linen Wrap Dress', price: 'R1,349', image: 'Linen Wrap Dress' },
    { id: 3, name: 'Cotton Sundress', price: 'R1,169', image: 'Cotton Sundress' },
    { id: 4, name: 'Chiffon Maxi', price: 'R1,699', image: 'Chiffon Maxi' }
  ];

  const saleItems = [
    { id: 5, name: 'Summer Slip Dress', price: 'R809', originalPrice: 'R1,349', image: 'Summer Slip Dress' },
    { id: 6, name: 'Boho Midi Dress', price: 'R989', originalPrice: 'R1,529', image: 'Boho Midi Dress' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>New Season, New You</h1>
          <p>Discover our curated collection of dreamy dresses in soft nude and lavender tones</p>
          <Link to="/shop" className="btn">Shop Now</Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <h2>New In</h2>
          <div className="product-grid">
            {newArrivals.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">{product.image}</div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <button className="btn" style={{width: '100%', marginTop: '0.5rem', fontSize: '0.8rem'}}>Add to My Wardrobe</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect Pairs - Cheerleader Effect */}
      <section className="section" style={{background: '#F9F9F9'}}>
        <div className="container">
          <h2>Perfect Together</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #F0F0F0'}}>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{flex: 1, height: '150px', background: 'linear-gradient(135deg, #F5F5DC 0%, #E6D7F0 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#8B7B93'}}>Silk Midi Dress</div>
                <div style={{width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8A8D8', fontSize: '1.2rem'}}>+</div>
                <div style={{flex: 1, height: '150px', background: 'linear-gradient(135deg, #F5F5DC 0%, #E6D7F0 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#8B7B93'}}>Chain Waist Band</div>
              </div>
              <h3 style={{marginBottom: '0.5rem', color: '#6B5B73'}}>Silk Midi + Chain Belt</h3>
              <p style={{fontSize: '0.9rem', color: '#8B7B93', marginBottom: '1rem'}}>Elevate your silhouette</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <span style={{textDecoration: 'line-through', color: '#999'}}>R2,408</span>
                <span style={{color: '#C8A8D8', fontWeight: '600', fontSize: '1.1rem'}}>R2,199</span>
              </div>
              <button className="btn" style={{width: '100%'}}>Get This Look</button>
            </div>
            
            <div style={{background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #F0F0F0'}}>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{flex: 1, height: '150px', background: 'linear-gradient(135deg, #F5F5DC 0%, #E6D7F0 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#8B7B93'}}>Linen Wrap Dress</div>
                <div style={{width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8A8D8', fontSize: '1.2rem'}}>+</div>
                <div style={{flex: 1, height: '150px', background: 'linear-gradient(135deg, #F5F5DC 0%, #E6D7F0 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#8B7B93'}}>Leather Waist Band</div>
              </div>
              <h3 style={{marginBottom: '0.5rem', color: '#6B5B73'}}>Linen Wrap + Leather Belt</h3>
              <p style={{fontSize: '0.9rem', color: '#8B7B93', marginBottom: '1rem'}}>Effortless chic vibes</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <span style={{textDecoration: 'line-through', color: '#999'}}>R1,978</span>
                <span style={{color: '#C8A8D8', fontWeight: '600', fontSize: '1.1rem'}}>R1,799</span>
              </div>
              <button className="btn" style={{width: '100%'}}>Get This Look</button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Categories */}
      <section className="section" style={{background: '#F9F9F9'}}>
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="product-grid">
            <div className="product-card">
              <div className="product-image">Summer Dresses</div>
              <div className="product-info">
                <h3>Dresses</h3>
                <p style={{color: '#8B7B93', marginBottom: '1rem', fontSize: '0.9rem'}}>Effortless elegance for every occasion</p>
                <Link to="/shop" className="btn">Shop Dresses</Link>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">Accessories</div>
              <div className="product-info">
                <h3>Accessories</h3>
                <p style={{color: '#8B7B93', marginBottom: '1rem', fontSize: '0.9rem'}}>Complete your perfect look</p>
                <Link to="/shop" className="btn">Shop Accessories</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Section */}
      <section className="section">
        <div className="container">
          <h2>Sale</h2>
          <div className="product-grid">
            {saleItems.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">{product.image}</div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">
                    {product.price} 
                    <span style={{textDecoration: 'line-through', color: '#999', marginLeft: '10px'}}>
                      {product.originalPrice}
                    </span>
                  </p>
                  <button className="btn" style={{width: '100%', marginTop: '0.5rem', fontSize: '0.8rem'}}>Claim Your Deal</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;