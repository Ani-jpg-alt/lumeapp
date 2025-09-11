import React from 'react';

function FAQ() {
  const faqs = [
    {
      question: "What sizes do you offer?",
      answer: "We offer sizes XS through XL. Please check our Size Guide for detailed measurements."
    },
    {
      question: "How do I care for my Nudes dress?",
      answer: "Most of our dresses are machine washable on gentle cycle. Always check the care label for specific instructions."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship within the United States. International shipping will be available soon."
    },
    {
      question: "What is your return policy?",
      answer: "We offer free returns within 30 days of purchase. Items must be unworn with tags attached."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for an additional fee."
    },
    {
      question: "Can I exchange my item for a different size?",
      answer: "Yes! We offer free exchanges within 30 days. Simply contact our customer service team."
    }
  ];

  return (
    <div className="section">
      <div className="container">
        <h1>Frequently Asked Questions</h1>
        
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          {faqs.map((faq, index) => (
            <div key={index} style={{marginBottom: '2rem', padding: '1.5rem', background: '#F5F5DC', borderRadius: '10px'}}>
              <h3 style={{color: '#D2B48C', marginBottom: '1rem'}}>{faq.question}</h3>
              <p style={{lineHeight: '1.6'}}>{faq.answer}</p>
            </div>
          ))}
          
          <div style={{textAlign: 'center', marginTop: '3rem', padding: '2rem', background: '#F5F5DC', borderRadius: '10px'}}>
            <h3>Still have questions?</h3>
            <p>Contact our customer service team at hello@nudes.com or call +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;