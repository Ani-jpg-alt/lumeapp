import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const products = [
    { id: 1, name: 'Jean Dress', price: 'R300', image: '/jean-dress.jpg', images: ['/jean-dress.jpg', '/jean-dress-2.jpg'], description: 'Every girl NEEDS a Jean short dress this summer!!!', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 2, name: 'Polka Dot Dress', price: 'R250', image: '/polka-dot-dress.jpg', images: ['/polka-dot-dress.jpg', '/polka-dot-dress-2.jpg'], description: 'We are stepping into summer with polka dots!', sizes: ['M', 'L', 'XL', 'XXL'] },
    { id: 3, name: 'Two Piece', price: 'R350', image: '/two-piece.jpg', images: ['/two-piece.jpg', '/two-piece-2.jpg', '/two-piece-3.jpg'], description: 'Every girl deserves a playful two piece this summer.', colors: ['Pink', 'Blue', 'Green'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] }
  ];

  const categories = [
    { name: 'Midi', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=200&fit=crop&auto=format&q=80' },
    { name: 'Maxi', image: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e8?w=300&h=200&fit=crop&auto=format&q=80' },
    { name: 'Summer', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=200&fit=crop&auto=format&q=80' },
    { name: 'Sale', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=200&fit=crop&auto=format&q=80' }
  ];

  return (
    <div>
      {/* Delivery Banner */}
      <div style={{background: '#e91e63', color: 'white', padding: '8px 0', textAlign: 'center', fontSize: '0.9rem'}}>
        <div className="container">
          📦 Delivery in 7 days via PEP & The Courier Guy
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,232,255,0.8)), url("https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=600&fit=crop&auto=format&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 0'
      }}>
        <div className="container">
          <h1 style={{fontSize: '3.5rem', color: '#333', textShadow: '2px 2px 4px rgba(255,255,255,0.8)'}}>Summer Vibes Only! ☀️</h1>
          <p style={{fontSize: '1.3rem', color: '#555', marginBottom: '2rem'}}>Slay this season with dresses that scream main character energy ✨</p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link to="/shop" className="btn" style={{fontSize: '1rem', padding: '15px 30px'}}>Shop Summer Fits</Link>
            <Link to="/about" className="btn" style={{background: 'transparent', color: '#e91e63', border: '2px solid #e91e63', fontSize: '1rem', padding: '15px 30px'}}>Our Story</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2>Categories</h2>
          <div className="categories">
            {categories.map((category, index) => (
              <Link key={index} to="/shop" className="category-card">
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2>New Arrivals</h2>
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  {product.description && (
                    <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>{product.description}</p>
                  )}
                  {product.colors && (
                    <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>Colors: {product.colors.join(', ')}</p>
                  )}
                  {product.sizes && (
                    <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>Sizes: {product.sizes.join(', ')}</p>
                  )}
                  <button className="btn" style={{width: '100%', fontSize: '0.8rem'}}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="section" style={{background: '#f8f9fa', padding: '2rem 0'}}>
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center'}}>
            <div>
              <h3 style={{marginBottom: '0.5rem', color: '#333'}}>Fast Delivery</h3>
              <p style={{color: '#666', fontSize: '0.9rem'}}>7 days via PEP & The Courier Guy</p>
            </div>
            <div>
              <h3 style={{marginBottom: '0.5rem', color: '#333'}}>Secure Payment</h3>
              <p style={{color: '#666', fontSize: '0.9rem'}}>Safe & trusted checkout</p>
            </div>
            <div>
              <h3 style={{marginBottom: '0.5rem', color: '#333'}}>Easy Exchanges</h3>
              <p style={{color: '#666', fontSize: '0.9rem'}}>30-day exchange policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;