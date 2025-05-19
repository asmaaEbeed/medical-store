import React, { useState, useContext, useRef, useEffect } from 'react'
import coupounDiscount from '../../assets/11.jpg';
import { Button, Col, Row } from 'react-bootstrap';
import CoupounModal from './CoupounModal';
import CouponContext from '../../shop/CouponContext';
import { Sparkles, Gift, Scissors, Tag, Clock } from 'lucide-react';
import './GetCoupon.css';
import { useNavigate } from 'react-router-dom';

const GetCoupon = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken') 
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const couponRef = useRef(null);
  const toggle = () => setShow(!show);
  const { getQrCode } = useContext(CouponContext);
  
  const handleCoupon = (e) => { 
    e.stopPropagation(); 
    // const token = localStorage.getItem('userToken');
    if( token ) {

      toggle(); 
      getQrCode();
    } else {
      navigate('/login');
    }
  }

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
    
    if (couponRef.current) {
      observer.observe(couponRef.current);
    }
    
    return () => {
      if (couponRef.current) {
        observer.unobserve(couponRef.current);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={couponRef} 
        className={`coupon-section ${isVisible ? 'visible' : ''}`}
      >
        <Row className="mx-4 d-flex align-items-stretch">
          <Col md={6} xs={12} className="p-3 d-flex">
            <div className="image-container">
              <img
                src={coupounDiscount}
                alt="Special Discount Offer"
                className="coupon-image"
              />
              <div className="image-overlay">
                <div className="discount-badge">
                  <span className="discount-value">20%</span>
                  <span className="discount-label">OFF</span>
                </div>
              </div>
            </div>
          </Col>

          <Col md={6} xs={12} className="p-3 d-flex">
            <div className="coupon-content">
              <div className="coupon-decoration top-left"></div>
              <div className="coupon-decoration top-right"></div>
              <div className="coupon-decoration bottom-left"></div>
              <div className="coupon-decoration bottom-right"></div>
              
              <div className="coupon-icon">
                <Gift size={32} />
              </div>
              
              <h2 className="coupon-title">
                Limited-Time Offer
                <Sparkles className="sparkle-icon" size={20} />
              </h2>
              
              <div className="coupon-details">
                <div className="coupon-detail-item">
                  <Tag size={16} />
                  <span>Save more on your first purchase!</span>
                </div>
                <div className="coupon-detail-item">
                  <Clock size={16} />
                  <span>Enjoy 20% off – don't miss out!</span>
                </div>
              </div>
              
              <div className="coupon-divider">
                <div className="divider-line"></div>
                <Scissors size={20} className="scissors-icon" />
                <div className="divider-line"></div>
              </div>
              <div
                
                data-bs-toggle="tooltip" data-bs-placement="top" title={!token ? "You should be logged in to get coupon": ""}
              >

              <Button
                onClick={(e) => handleCoupon(e)}
                className="coupon-button"
                >
                <span>Get Coupon</span>
                <div className="button-shine"></div>
              </Button>
                </div>
              
              <div className="coupon-note">
                *Terms and conditions apply
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <CoupounModal showModal={show} toggle={toggle} />
    </>
  )
}

export default GetCoupon;
