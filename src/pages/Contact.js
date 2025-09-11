import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    captcha: ''
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
    setFormData({ name: '', email: '', subject: '', message: '', captcha: '' });
  };

  return (
    <div className="section">
      <div className="container">
        <h1>Contact</h1>
        
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          {/* Contact Form */}
          <div>
            <p style={{marginBottom: '2rem'}}>
              Questions about products, sizing, or feedback? We'd love to hear from you.
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
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="captcha">What is 5 + 3? *</label>
                <input
                  type="text"
                  id="captcha"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  placeholder="Enter the answer"
                  required
                />
              </div>
              
              <button type="submit" className="btn" style={{width: '100%'}}>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>

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