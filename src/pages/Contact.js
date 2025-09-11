import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: ''
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
    setFormData({ name: '', email: '', subject: '' });
  };

  return (
    <div className="section">
      <div className="container">
        <h1>Contact Us</h1>
        
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
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
              

              
              <button type="submit" className="btn" style={{width: '100%'}}>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2>Contact Information</h2>
            <div style={{background: 'rgba(212, 187, 255, 0.1)', padding: '2rem', borderRadius: '20px'}}>
              <p style={{marginBottom: '1rem'}}><strong>Email:</strong> privacy@lumebylee.co.za</p>
              <p><strong>Phone:</strong> 074 485 0947</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;