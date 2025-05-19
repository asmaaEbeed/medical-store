import React, { useEffect, useRef, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay, Pagination } from 'swiper/modules';
import { FaHandHoldingHeart, FaShieldAlt, FaChartLine, FaHeartbeat, FaClock } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import './Donations.css';

const HeroSection = () => {
  const swiperRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Space/Sky effect with golden particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const stars = [];
    const particleCount = isMobile ? 40 : 80; // Reduce particles on mobile
    const starCount = isMobile ? 100 : 200; // Reduce stars on mobile
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create stars (small static points)
    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.05;
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
      }
      
      update() {
        // Twinkle effect
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        
        if (this.opacity >= 1 || this.opacity <= 0.2) {
          this.twinkleDirection *= -1;
        }
      }
      
      draw() {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles (moving golden dust)
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        
        // Golden color palette with varying opacity
        const goldHue = Math.random() * 30 + 40; // 40-70 range for gold hues
        const saturation = Math.random() * 20 + 80; // 80-100% saturation
        const lightness = Math.random() * 20 + 50; // 50-70% lightness
        const opacity = Math.random() * 0.5 + 0.2;
        
        this.color = `hsla(${goldHue}, ${saturation}%, ${lightness}%, ${opacity})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.size > 0.2) this.size -= 0.01;
        
        // Boundary check with wrap-around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const init = () => {
      // Initialize stars
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
      
      // Initialize particles
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    const animate = () => {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0c1633'); // Darker at top
      gradient.addColorStop(1, '#1d3266'); // Slightly lighter at bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
      }
      
      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect particles with lines - reduce connections on mobile
        if (!isMobile) {
          for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 215, 0, ${0.05 - distance/2000})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
        
        // Replace particles that are too small
        if (particles[i].size <= 0.2) {
          particles.splice(i, 1);
          particles.push(new Particle());
        }
      }
      
      // Occasional shooting star - less frequent on mobile
      if (Math.random() < (isMobile ? 0.005 : 0.01)) {
        createShootingStar();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Create shooting star effect
    const createShootingStar = () => {
      const shootingStar = {
        x: Math.random() * canvas.width,
        y: 0,
        length: Math.random() * 80 + 100,
        speed: Math.random() * 10 + 10,
        angle: Math.random() * 45 + 10, // angle in degrees
        opacity: 1
      };
      
      const drawShootingStar = () => {
        if (shootingStar.opacity <= 0) return;
        
        const radians = shootingStar.angle * Math.PI / 180;
        const endX = shootingStar.x + Math.cos(radians) * shootingStar.length;
        const endY = shootingStar.y + Math.sin(radians) * shootingStar.length;
        
        // Create gradient for the shooting star
        const gradient = ctx.createLinearGradient(
          shootingStar.x, shootingStar.y, endX, endY
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        gradient.addColorStop(0.3, `rgba(255, 240, 200, ${shootingStar.opacity})`);
        gradient.addColorStop(1, `rgba(255, 215, 0, 0)`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Update position
        shootingStar.x += Math.cos(radians) * shootingStar.speed;
        shootingStar.y += Math.sin(radians) * shootingStar.speed;
        
        // Fade out
        shootingStar.opacity -= 0.01;
        
        if (shootingStar.opacity > 0) {
          requestAnimationFrame(drawShootingStar);
        }
      };
      
      drawShootingStar();
    };
    
    init();
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile]);

  const slides = [
    {
      title: "Make a Difference Today",
      description: "Your generosity can transform lives and bring hope to those in need",
      icon: <FaHandHoldingHeart />,
      color: "rgba(235, 77, 75, 0.8)"
    },
    {
      title: "Security First",
      description: "All donations are processed through secure payment gateways to protect your information",
      icon: <FaShieldAlt />,
      color: "rgba(106, 176, 76, 0.8)"
    },
    {
      title: "Full Transparency",
      description: "We provide detailed reports on how your donations are used to help those in need",
      icon: <FaChartLine />,
      color: "rgba(34, 166, 179, 0.8)"
    },
    {
      title: "Maximum Impact",
      description: "100% of your donation goes directly to providing medical care and support",
      icon: <FaHeartbeat />,
      color: "rgba(190, 46, 221, 0.8)"
    },
    {
      title: "Urgent Response",
      description: "We prioritize critical cases to ensure timely assistance where it's needed most",
      icon: <FaClock />,
      color: "rgba(72, 52, 212, 0.8)"
    }
  ];

  return (
    <div className="hero-section-container vh-100 position-relative overflow-hidden" style={{ backgroundColor: '#132354' }}>
      {/* Canvas for space/sky effect */}
      <canvas 
        ref={canvasRef} 
        className="space-canvas position-absolute top-0 start-0 w-100 h-100"
        style={{
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <Container className="position-relative h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 3 }}>
        <Row className="w-100 gy-4">
          <Col lg={6} className="pt-md-0 pt-sm-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white px-2 px-md-0"
            >
              <h4 className={`${isMobile ? 'display-5' : 'display-3'} fw-bold mb-3 mb-md-4 `}>
                Make a Difference Today
              </h4>
              <p className={`${isMobile ? 'lead fs-6' : 'lead'} mb-4 mb-md-5`}>
                Your generosity can transform lives and bring hope.
                {!isMobile && <br/>} Join us in our mission to create positive change.
              </p>
              <div className="d-flex flex-wrap">
  <Link
    to="#donation-cases"
    className="text-decoration-none me-2 me-md-3 mb-2 mb-md-0"
  >
    <Button
      variant="outline-warning"
      size={isMobile ? "md" : "lg"}
      className="rounded-pill fw-semibold px-3 py-2 px-md-4 py-md-3 btn-glow"
      onClick={() => {
        const element = document.getElementById('donation-cases');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      Donate Now
    </Button>
  </Link>
  
  <Link
    to="/contact"
    className="text-decoration-none"
  >
    <Button
      variant="outline-light"
      size={isMobile ? "md" : "lg"}
      className="rounded-pill fw-semibold px-3 py-2 px-md-4 py-md-3 btn-con"
    >
      Contact US
    </Button>
  </Link>
</div>

            </motion.div>
          </Col>
          <Col lg={6} md={8} className="mx-auto">
            <div className="swiper-container pb-md-0 pb-sm-5" style={{ height: isMobile ? '290px' : '450px' }}>
              <Swiper
                ref={swiperRef}
                effect={'cards'}
                grabCursor={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[EffectCards, Autoplay, Pagination]}
                className="tinder-swiper"
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index} className="tinder-slide">
                    <div 
                      className="tinder-card h-100 w-100 d-flex flex-column justify-content-center align-items-center text-center p-3 p-md-4"
                      style={{
                        backgroundColor: slide.color
                      }}
                    >
                      <div className="icon-container mb-3 mb-md-4">
                        {slide.icon}
                      </div>
                      <h3 className="fw-bold mb-2 mb-md-3" style={{ fontSize: isMobile ? '1.5rem' : '1.8rem' }}>
                        {slide.title}
                      </h3>
                      <p className="mb-0" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                        {slide.description}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .swiper-container {
          width: 100%;
          height: 450px;
          padding: 20px 0;
        }
        
        .tinder-swiper {
          width: 90%;
          height: 100%;
        }
        
        .tinder-slide {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          font-size: 22px;
          font-weight: bold;
          color: white;
        }
        
        .tinder-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .icon-container {
          font-size: 3rem;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .btn-glow {
          position: relative;
          overflow: hidden;
          z-index: 1;
          transition: all 0.3s ease;
        }
        
        .btn-glow:after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0)
          );
          transform: rotate(30deg);
          opacity: 0;
          transition: all 0.6s ease;
          z-index: -1;
        }
        
        .btn-glow:hover:after {
          opacity: 1;
          left: 100%;
        }
        
        .btn-glow:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        .btn-con:hover {
          color: darkblue !important;
        }
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: white;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: white;
          transform: scale(1.3);
        }
        
        @media (max-width: 992px) {
          .swiper-container {
            height: 350px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
