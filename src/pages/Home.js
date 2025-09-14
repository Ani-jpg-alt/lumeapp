import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function Home() {
  const { addToCart } = useCart();
  
  const products = [
    { id: 1, name: 'Jean Dress', price: 'R300', image: '/jean-dress.jpg', images: ['/jean-dress.jpg', '/jean-dress-2.jpg'], description: 'Every girl NEEDS a Jean short dress this summer!!!', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 2, name: 'Polka Dot Dress', price: 'R250', image: '/polka-dot-dress.jpg', images: ['/polka-dot-dress.jpg', '/polka-dot-dress-2.jpg'], description: 'We are stepping into summer with polka dots!', sizes: ['M', 'L', 'XL', 'XXL'] },
    { id: 3, name: 'Two Piece', price: 'R350', image: '/two-piece.jpg', images: ['/two-piece.jpg', '/two-piece-2.jpg', '/two-piece-3.jpg'], description: 'Every girl deserves a playful two piece this summer.', colors: ['Pink', 'Blue', 'Green'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] }
  ];

  const categories = [
    { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=200&fit=crop&auto=format&q=80' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&auto=format&q=80' },
    { name: 'Gym Sets', image: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=300&h=200&fit=crop&auto=format&q=80' }
  ];

  return (
    <div>
      {/* Delivery Banner */}
      <div style={{background: 'linear-gradient(135deg, #e91e63, #f8e8ff)', color: 'white', padding: '10px 0', textAlign: 'center', fontSize: '0.9rem', boxShadow: '0 2px 10px rgba(233, 30, 99, 0.2)'}}>
        <div className="container">
          Delivery in 5-7 days via PEP & The Courier Guy - Parcel Lockers
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero" style={{
        background: 'linear-gradient(135deg, rgba(248,232,255,0.95), rgba(212,187,255,0.9)), url("https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=600&fit=crop&auto=format&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 0'
      }}>
        <div className="container">
          <h1 style={{fontSize: '3.5rem', color: '#333', textShadow: '2px 2px 4px rgba(255,255,255,0.8)'}}>Your Glow Era Starts Here</h1>
          <p style={{fontSize: '1.3rem', color: '#555', marginBottom: '2rem'}}>Slay this season with dresses that scream main character energy</p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link to="/shop" className="btn" style={{fontSize: '1rem', padding: '15px 30px', boxShadow: '0 8px 20px rgba(233, 30, 99, 0.3)'}}>Shop Summer Fits</Link>
            <Link to="/about" className="btn" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,232,255,0.8))', color: '#e91e63', border: '2px solid #e91e63', fontSize: '1rem', padding: '15px 30px', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.2)'}}>Our Story</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{background: 'linear-gradient(135deg, #f8f9fa, #f0f8ff)', padding: '4rem 0'}}>
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '3rem', color: '#e91e63'}}>Shop by Category</h2>
          <div className="categories">
            {categories.map((category, index) => (
              <Link key={index} to="/shop" className="category-card" style={{background: 'linear-gradient(135deg, #fff, #f8e8ff)', border: '2px solid transparent', backgroundClip: 'padding-box'}}>
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-info">
                  <h3 style={{color: '#e91e63'}}>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '3rem', color: '#e91e63'}}>New Arrivals</h2>
          <div className="product-grid">
            {products.map((product, index) => (
              <div key={product.id} className="product-card" style={{background: 'linear-gradient(135deg, #fff, #f8e8ff)', border: '1px solid rgba(233, 30, 99, 0.1)'}}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 style={{color: '#e91e63'}}>{product.name}</h3>
                  <p className="price" style={{fontSize: '1.2rem', fontWeight: '700'}}>{product.price}</p>
                  {product.description && (
                    <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>{product.description}</p>
                  )}
                  {product.colors && (
                    <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>Colors: {product.colors.join(', ')}</p>
                  )}
                  {product.sizes && (
                    <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem'}}>Sizes: {product.sizes.join(', ')}</p>
                  )}
                  <button 
                    className="btn" 
                    style={{width: '100%', fontSize: '0.8rem', background: 'linear-gradient(135deg, #e91e63, #f8e8ff)', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)'}}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="section" style={{background: 'linear-gradient(135deg, #f8e8ff, #e8d5ff)', padding: '3rem 0'}}>
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '2rem', color: '#e91e63'}}>Princess Treatment</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center'}}>
            <div style={{background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.1)'}}>
              <h3 style={{marginBottom: '0.5rem', color: '#e91e63'}}>Fast Delivery</h3>
              <p style={{color: '#666', fontSize: '0.9rem'}}>5-7 days via PEP & The Courier Guy</p>
            </div>
            <div style={{background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.1)'}}>
              <h3 style={{marginBottom: '0.5rem', color: '#e91e63'}}>Secure Payment</h3>
              <p style={{color: '#666', fontSize: '0.9rem'}}>Safe & trusted checkout</p>
            </div>
            <div style={{background: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(233, 30, 99, 0.1)'}}>
              <h3 style={{marginBottom: '0.5rem', color: '#e91e63'}}>Size Exchanges</h3>
              <p style={{color: '#666', fontSize: '0.9rem'}}>7-day size exchange policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;