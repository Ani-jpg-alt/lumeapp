import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const newArrivals = [
    { id: 1, name: 'Silk Midi Dress', price: 'R1,599', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 2, name: 'Linen Wrap Dress', price: 'R1,349', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 3, name: 'Cotton Sundress', price: 'R1,169', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 4, name: 'Chiffon Maxi', price: 'R1,699', image: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e8?w=400&h=500&fit=crop&auto=format&q=80' }
  ];

  const saleItems = [
    { id: 5, name: 'Summer Slip Dress', price: 'R809', originalPrice: 'R1,349', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop&auto=format&q=80' },
    { id: 6, name: 'Boho Midi Dress', price: 'R989', originalPrice: 'R1,529', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d24?w=400&h=500&fit=crop&auto=format&q=80' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div style={{background: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', marginBottom: '2rem', borderRadius: '20px'}}>
            🚚 FREE SHIPPING ON ORDERS OVER R500 | 🔄 30-DAY FREE RETURNS
          </div>
          <h1>New Season, New You</h1>
          <p>Discover our curated collection of dreamy dresses in soft nude tones</p>
          <Link to="/shop" className="btn">Shop Now</Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <h2>New In</h2>
          <div className="product-grid">
            {newArrivals.slice(0, 6).map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div style={{position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '8px', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s ease'}}>
                    <span style={{fontSize: '1.2rem'}}>🤍</span>
                  </div>
                  <div style={{position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem'}}>New</div>
                </div>
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
      <section className="section" style={{background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(15px)', margin: '3rem 0', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)'}}>
        <div className="container">
          <h2>Perfect Together</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)'}}>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{flex: 1, height: '150px', background: 'linear-gradient(135deg, #F5F5DC 0%, #E8D5C4 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#2D2D2D'}}>Silk Midi Dress</div>
                <div style={{width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D2B48C', fontSize: '1.2rem'}}>+</div>
                <div style={{flex: 1, height: '150px', background: 'linear-gradient(135deg, #F5F5DC 0%, #E8D5C4 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#2D2D2D'}}>Chain Waist Band</div>
              </div>
              <h3 style={{marginBottom: '0.5rem', color: '#1A1A1A'}}>Silk Midi + Chain Belt</h3>
              <p style={{fontSize: '0.9rem', color: '#2D2D2D', marginBottom: '1rem'}}>Elevate your silhouette</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <span style={{textDecoration: 'line-through', color: '#999'}}>R2,408</span>
                <span style={{color: '#D2B48C', fontWeight: '600', fontSize: '1.1rem'}}>R2,199</span>
              </div>
              <button className="btn" style={{width: '100%'}}>Get This Look</button>
            </div>
            
            <div style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)'}}>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <div style={{flex: 1, height: '150px', background: 'linear-gradient(135deg, #F5F5DC 0%, #E8D5C4 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#2D2D2D'}}>Linen Wrap Dress</div>
                <div style={{width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D2B48C', fontSize: '1.2rem'}}>+</div>
                <div style={{flex: 1, height: '150px', background: 'linear-gradient(135deg, #F5F5DC 0%, #E8D5C4 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#2D2D2D'}}>Leather Waist Band</div>
              </div>
              <h3 style={{marginBottom: '0.5rem', color: '#1A1A1A'}}>Linen Wrap + Leather Belt</h3>
              <p style={{fontSize: '0.9rem', color: '#2D2D2D', marginBottom: '1rem'}}>Effortless chic vibes</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <span style={{textDecoration: 'line-through', color: '#999'}}>R1,978</span>
                <span style={{color: '#D2B48C', fontWeight: '600', fontSize: '1.1rem'}}>R1,799</span>
              </div>
              <button className="btn" style={{width: '100%'}}>Get This Look</button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Categories */}
      <section className="section" style={{background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(15px)', margin: '3rem 0', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)'}}>
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="product-grid">
            <div className="product-card">
              <div className="product-image">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop&auto=format&q=80" alt="Dresses" />
              </div>
              <div className="product-info">
                <h3>Dresses</h3>
                <p style={{color: '#2D2D2D', marginBottom: '1rem', fontSize: '0.9rem'}}>Effortless elegance for every occasion</p>
                <Link to="/shop" className="btn">Shop Dresses</Link>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&auto=format&q=80" alt="Accessories" />
              </div>
              <div className="product-info">
                <h3>Accessories</h3>
                <p style={{color: '#2D2D2D', marginBottom: '1rem', fontSize: '0.9rem'}}>Complete your perfect look</p>
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
            {saleItems.slice(0, 4).map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div style={{position: 'absolute', top: '15px', left: '15px', background: '#FF6B6B', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600'}}>SALE</div>
                  <div style={{position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '8px', borderRadius: '50%', cursor: 'pointer'}}>
                    <span style={{fontSize: '1.2rem'}}>🤍</span>
                  </div>
                </div>
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

      {/* Recently Viewed */}
      <section className="section">
        <div className="container">
          <h2>You Recently Viewed</h2>
          <div className="product-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', maxWidth: '800px', margin: '0 auto'}}>
            <div className="product-card">
              <div className="product-image" style={{height: '200px'}}>
                <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=200&fit=crop&auto=format&q=80" alt="Cotton Sundress" />
              </div>
              <div className="product-info">
                <h3 style={{fontSize: '0.9rem'}}>Cotton Sundress</h3>
                <p className="price" style={{fontSize: '1rem'}}>R1,169</p>
                <button className="btn" style={{width: '100%', fontSize: '0.8rem', padding: '8px'}}>View Again</button>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image" style={{height: '200px'}}>
                <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&auto=format&q=80" alt="Chain Waist Band" />
              </div>
              <div className="product-info">
                <h3 style={{fontSize: '0.9rem'}}>Chain Waist Band</h3>
                <p className="price" style={{fontSize: '1rem'}}>R809</p>
                <button className="btn" style={{width: '100%', fontSize: '0.8rem', padding: '8px'}}>View Again</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;