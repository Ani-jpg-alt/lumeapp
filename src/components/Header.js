import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">Lume</Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/size-guide">Size Guide</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li style={{position: 'relative'}}>
              <span style={{background: '#8B4A9C', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer'}}>🛍️ Cart (2)</span>
            </li>
            <li style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <a href="https://instagram.com/lumebylangelihle" target="_blank" rel="noopener noreferrer" style={{color: '#8B4A9C', fontSize: '1.2rem', textDecoration: 'none'}}>📷</a>
              <a href="https://tiktok.com/@lumebylangelihle" target="_blank" rel="noopener noreferrer" style={{color: '#8B4A9C', fontSize: '1.2rem', textDecoration: 'none'}}>🎥</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;