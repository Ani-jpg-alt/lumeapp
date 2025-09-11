import React from 'react';

function SizeGuide() {
  return (
    <div className="section">
      <div className="container">
        <h1>Size Guide</h1>
        
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <p style={{textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem'}}>
            Find your perfect fit with our comprehensive size guide. All measurements are in inches.
          </p>

          {/* Dress Sizes */}
          <section style={{marginBottom: '3rem'}}>
            <h2>Dress Sizes</h2>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
                <thead>
                  <tr style={{background: '#F5F5DC'}}>
                    <th style={{padding: '12px', border: '1px solid #ddd', textAlign: 'left'}}>Size</th>
                    <th style={{padding: '12px', border: '1px solid #ddd', textAlign: 'left'}}>Bust</th>
                    <th style={{padding: '12px', border: '1px solid #ddd', textAlign: 'left'}}>Waist</th>
                    <th style={{padding: '12px', border: '1px solid #ddd', textAlign: 'left'}}>Hips</th>
                    <th style={{padding: '12px', border: '1px solid #ddd', textAlign: 'left'}}>Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>XS</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>32-34</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>24-26</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>34-36</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>35-36</td>
                  </tr>
                  <tr style={{background: '#FAFAFA'}}>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>S</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>34-36</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>26-28</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>36-38</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>36-37</td>
                  </tr>
                  <tr>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>M</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>36-38</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>28-30</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>38-40</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>37-38</td>
                  </tr>
                  <tr style={{background: '#FAFAFA'}}>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>L</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>38-40</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>30-32</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>40-42</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>38-39</td>
                  </tr>
                  <tr>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>XL</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>40-42</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>32-34</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>42-44</td>
                    <td style={{padding: '12px', border: '1px solid #ddd'}}>39-40</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* How to Measure */}
          <section style={{background: '#F5F5DC', padding: '2rem', borderRadius: '10px', marginBottom: '3rem'}}>
            <h2>How to Measure</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '1rem'}}>
              <div>
                <h3 style={{color: '#D2B48C', marginBottom: '0.5rem'}}>Bust</h3>
                <p>Measure around the fullest part of your bust, keeping the tape parallel to the floor.</p>
              </div>
              <div>
                <h3 style={{color: '#D2B48C', marginBottom: '0.5rem'}}>Waist</h3>
                <p>Measure around your natural waistline, which is the narrowest part of your torso.</p>
              </div>
              <div>
                <h3 style={{color: '#D2B48C', marginBottom: '0.5rem'}}>Hips</h3>
                <p>Measure around the fullest part of your hips, approximately 8 inches below your waist.</p>
              </div>
              <div>
                <h3 style={{color: '#D2B48C', marginBottom: '0.5rem'}}>Length</h3>
                <p>Measure from the highest point of your shoulder down to where you want the dress to end.</p>
              </div>
            </div>
          </section>

          {/* Fit Tips */}
          <section>
            <h2>Fit Tips</h2>
            <ul style={{fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '2rem'}}>
              <li>If you're between sizes, we recommend sizing up for a more comfortable fit</li>
              <li>Our dresses are designed with a relaxed, flowing fit perfect for summer</li>
              <li>Check the specific product description for any fit notes or recommendations</li>
              <li>Contact our customer service team if you need help choosing the right size</li>
              <li>We offer free exchanges within 30 days if the size isn't quite right</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SizeGuide;