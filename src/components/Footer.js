import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Customer Service</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/returns">Returns Policy</Link></li>
              <li><Link to="/shipping">Shipping & Delivery</Link></li>
              <li><Link to="/tracking">Track Your Order</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>About</h3>
            <ul>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <ul>
              <li><a href="https://www.instagram.com/by.langelihle/" target="_blank" rel="noopener noreferrer">📷 Instagram</a></li>
              <li><a href="https://www.tiktok.com/@by.langelihle" target="_blank" rel="noopener noreferrer">🎥 TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Lume by Langelihle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;