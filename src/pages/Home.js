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
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Summer Dresses</h1>
          <p>Perfect for every occasion</p>
          <Link to="/shop" className="btn">Shop Now</Link>
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
    </div>
  );
}

export default Home;