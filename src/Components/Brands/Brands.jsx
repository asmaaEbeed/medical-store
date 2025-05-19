import React, { useState, useEffect, useRef } from 'react';
import img1 from '../../assets/images/brands/1-.png';
import img2 from '../../assets/images/brands/2-.png';
import img3 from '../../assets/images/brands/3-.png';
import img4 from '../../assets/images/brands/4-.png';
import img5 from '../../assets/images/brands/5-.png';
import img6 from '../../assets/images/brands/6-.png';
import { Container, Row, Col } from 'react-bootstrap';
import { Award, TrendingUp, Shield, ThumbsUp } from 'lucide-react';
import './Brands.css';

const Brands = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const sectionRef = useRef(null);

  const brands = [
    { id: 1, name: "Dr. Stanly", image: img1, description: "Premium healthcare solutions since 1985" },
    { id: 2, name: "Medico", image: img2, description: "Innovative medical technology" },
    { id: 3, name: "OC Brand", image: img3, description: "Trusted by professionals worldwide" },
    { id: 4, name: "Nana", image: img4, description: "Natural ingredients, exceptional results" },
    { id: 5, name: "Don & Dim", image: img5, description: "Luxury skincare for all" },
    { id: 6, name: "AI Brand", image: img6, description: "Future of healthcare technology" }
  ];

  // Intersection Observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-rotate through brands
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => {
        if (prev === null) return 0;
        return (prev + 1) % brands.length;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isVisible, brands.length]);

  return (
    <section 
      ref={sectionRef} 
      className={`brands-showcase ${isVisible ? 'visible' : ''}`}
    >
      <Container>
        <div className="brands-header">
          <h2 className="brands-title">Trusted by Leading Brands</h2>
          <div className="brands-subtitle">
            <span>Partners in Excellence</span>
            <div className="title-underline"></div>
          </div>
        </div>
        
        <div className="brands-features">
          <div className="feature-item">
            <Shield className="feature-icon" />
            <span>Quality Assured</span>
          </div>
          <div className="feature-item">
            <Award className="feature-icon" />
            <span>Award Winning</span>
          </div>
          <div className="feature-item">
            <TrendingUp className="feature-icon" />
            <span>Industry Leaders</span>
          </div>
          <div className="feature-item">
            <ThumbsUp className="feature-icon" />
            <span>Customer Approved</span>
          </div>
        </div>
        
        <div className="brands-container">
          <Row className="brands-row g-4 justify-content-center align-items-center">
            {brands.map((brand, index) => (
              <Col 
                key={brand.id} 
                xs={6} md={4} lg={2} 
                className={`brand-col ${activeIndex === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="brand-card">
                  <div className="brand-image-container">
                    <img 
                      src={brand.image} 
                      alt={brand.name} 
                      className="brand-image" 
                    />
                    <div className="brand-overlay">
                      <div className="brand-info">
                        <h4>{brand.name}</h4>
                        <p>{brand.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        
        {/* <div className="brands-testimonial">
          <div className="testimonial-quote">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H8C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7M18 14H14C13.4696 14 12.9609 14.2107 12.5858 14.5858C12.2107 14.9609 12 15.4696 12 16V18C12 18.5304 12.2107 19.0391 12.5858 19.4142C12.9609 19.7893 13.4696 20 14 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V16C18 15.4696 17.7893 14.9609 17.4142 14.5858C17.0391 14.2107 16.5304 14 16 14H14C14 12.9391 14.4214 11.9217 15.1716 11.1716C15.9217 10.4214 16.9391 10 18 10H20M10 7V5C10 3.93913 9.57857 2.92172 8.82843 2.17157C8.07828 1.42143 7.06087 1 6 1H4M10 7V16C10 17.0609 9.57857 18.0783 8.82843 18.8284C8.07828 19.5786 7.06087 20 6 20H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>We're proud to partner with these industry-leading brands to bring you the highest quality products and services.</p>
          </div>
        </div> */}
        
        {/* <div className="brands-cta">
          <button className="become-partner-btn">
            <span>Become a Partner</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div> */}
      </Container>
      
      <div className="brands-background-elements">
        {/* <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div> */}
        <div className="bg-dots"></div>
      </div>
    </section>
  );
};

export default Brands;
