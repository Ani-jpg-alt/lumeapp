import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="section">
      <div className="container">
        <h1>Contact Us</h1>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto'}}>
          {/* Contact Form */}
          <div>
            <h2>Get in Touch</h2>
            <p style={{marginBottom: '2rem'}}>
              Have a question about our products, need sizing help, or want to share feedback? 
              We'd love to hear from you!
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="sizing-help">Sizing Help</option>
                  <option value="order-status">Order Status</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn" style={{width: '100%'}}>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2>Contact Information</h2>
            
            <div style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px', marginBottom: '2rem'}}>
              <h3 style={{color: '#D2B48C', marginBottom: '1rem'}}>Customer Service</h3>
              <p><strong>Email:</strong> hello@nudes.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday - Friday, 9AM - 6PM EST</p>
            </div>

            <div style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px', marginBottom: '2rem'}}>
              <h3 style={{color: '#D2B48C', marginBottom: '1rem'}}>Business Address</h3>
              <p>Nudes Fashion<br/>
              123 Fashion Avenue<br/>
              New York, NY 10001<br/>
              United States</p>
            </div>

            <div style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px'}}>
              <h3 style={{color: '#D2B48C', marginBottom: '1rem'}}>Response Times</h3>
              <p><strong>Email:</strong> Within 24 hours</p>
              <p><strong>Phone:</strong> Immediate during business hours</p>
              <p><strong>Returns:</strong> Processed within 3-5 business days</p>
            </div>

            <div style={{marginTop: '2rem'}}>
              <h3>Follow Us</h3>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                <a href="#" onClick={(e) => e.preventDefault()} className="btn">Instagram</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="btn">Facebook</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="btn">Pinterest</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;