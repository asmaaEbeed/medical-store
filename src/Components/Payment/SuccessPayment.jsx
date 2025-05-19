import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { FaCheckCircle, FaHome } from 'react-icons/fa';

const SuccessPayment = () => {
  const [countdown, setCountdown] = useState(5);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // First useEffect to handle page load
  useEffect(() => {
    // Set a small delay to ensure the component is fully rendered
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(loadTimer);
  }, []);

  // Second useEffect to handle countdown after page is loaded
  useEffect(() => {
    let timer;
    let redirectTimer;

    if (isLoaded) {
      // Start countdown only after page is loaded
      timer = setInterval(() => {
        setCountdown((prev) => {
          // When we reach 0, clear the interval to prevent negative numbers
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Redirect to home page after countdown completes
      redirectTimer = setTimeout(() => {
        navigate('/');
      }, countdown * 1000);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [isLoaded, navigate, countdown]);

  // Calculate progress percentage for the progress bar
  const progressPercentage = ((5 - countdown) / 5) * 100;

  return (
    <div className="bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
              <div className="bg-success text-white text-center py-4">
                <FaCheckCircle size={60} className="mb-3" />
                <h2 className="fw-bold">Payment Successful!</h2>
              </div>
              
              <Card.Body className="p-5 text-center">
                <p className="lead mb-4">
                  Thank you for your purchase. Your order has been confirmed and is being processed.
                </p>
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Redirecting to home page</span>
                  <span className="fw-bold">{countdown}s</span>
                </div>
                
                <ProgressBar 
                  now={progressPercentage} 
                  variant="success" 
                  className="mb-4" 
                  style={{ height: '8px' }} 
                />
                
                <Button 
                  variant="outline-success" 
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => navigate('/')}
                >
                  <FaHome className="me-2" />
                  Return to Home Now
                </Button>
              </Card.Body>
            </Card>
            
            <div className="text-center mt-4 text-muted">
              <small>
                A confirmation email has been sent to your registered email address.
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SuccessPayment;
