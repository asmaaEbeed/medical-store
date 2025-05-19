import { useContext, useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Button, Form, Spinner } from 'react-bootstrap';
import { Mail, ChevronRight, ArrowLeft, Sparkles } from "lucide-react";
import logo from "../../assets/images/Logo_light.png";
import style from './ForgetPassword.module.css';
import { UserContext } from '../../shop/UserContext';

export default function ForgetPassword() {
  const navigate = useNavigate();
  const { isLoading, error, sendPasswordResetCode } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [codeSent, setCodeSent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  // Initialize animations after component mounts
  useEffect(() => {
    // Delayed loading state for entrance animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // Initialize particle animation
    initParticles();

    // Track mouse movement for 3D effect
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Particle animation
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5
      });
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });
    }
    
    animate();
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  // Calculate 3D transform based on mouse position
  const getCardStyle = () => {
    if (!isLoaded) return { opacity: 0, transform: 'translateY(40px)' };
    
    const rotateX = (mousePosition.y - 0.5) * 10; // -5 to 5 degrees
    const rotateY = (mousePosition.x - 0.5) * 10; // -5 to 5 degrees
    
    return {
      opacity: 1,
      transform: isCardFlipped
        ? `translateY(0) rotateY(180deg)`
        : `translateY(0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setRequestError(null);
    setIsCardFlipped(true);

    try {
      // Update to use the correct format for the sendPasswordResetCode function
      const response = await sendPasswordResetCode({ email: values.email });
      console.log('Reset code response:', response);

      toast.success('Verification code sent to your email!');
      toast.info('If you don\'t see the email in your inbox, please check your spam/junk folder.', {
        autoClose: 4000
      });
      setCodeSent(true);
      setTimeout(() => {
        navigate('/resetpassword', { state: { email: values.email } });
      }, 2000);
    } catch (err) {
      console.error('Error sending verification code:', err);
      console.error('Error details:', err.response);
      const errorMessage = err.response?.data?.error || 'Failed to send verification code';
      setRequestError(errorMessage);
      toast.error(errorMessage);
      setIsCardFlipped(false);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className={style.forgotPasswordPage}>
      {/* Particle canvas background */}
      <canvas ref={canvasRef} className={style.particleCanvas}></canvas>
      
      {/* Animated background elements */}
      <div className={style.backgroundElements}>
        <div className={style.gradientOrb}></div>
        <div className={style.gradientOrb}></div>
        <div className={style.gradientOrb}></div>
      </div>
      
      <Container fluid className={style.mainContainer}>
        <div className={`${style.logoContainer} ${isLoaded ? style.logoLoaded : ''}`}>
          <img src={logo} alt="Logo" className={style.logo} />
        </div>
        
        <div className={style.contentWrapper}>
          {/* 3D Card with flip effect */}
          <div 
            ref={cardRef}
            className={`${style.forgotPasswordCard} ${isCardFlipped ? style.flipped : ''}`} 
            style={getCardStyle()}
          >
            {/* Front side of card (forgot password form) */}
            <div className={style.cardFront}>
              <div className={style.cardHeader}>
                <h2>
                  <span className={style.titleText}>Forgot Password</span>
                  <Sparkles className={style.sparkleIcon} size={20} />
                </h2>
                <p>Enter your email address and we'll send you a verification code to reset your password.</p>
              </div>
              
              <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, isSubmitting }) => (
                  <Form onSubmit={handleSubmit} className={style.forgotPasswordForm}>
                    {(requestError || error) && <div className={style.errorMessage}>{requestError || error}</div>}

                    <Form.Group className={style.formGroup}>
                      <div 
                        className={`${style.inputWithIcon} ${activeField === 'email' ? style.inputActive : ''}`}
                        onClick={() => document.getElementById('email-field').focus()}
                      >
                        <div className={style.inputIconWrapper}>
                          <Mail size={18} className={style.inputIcon} />
                        </div>
                        <Form.Control
                          id="email-field"
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={(e) => {
                            handleBlur(e);
                            setActiveField(null);
                          }}
                          onFocus={() => setActiveField('email')}
                          className={style.formControl}
                          isInvalid={touched.email && errors.email}
                        />
                      </div>
                      {touched.email && errors.email && (
                        <div className={style.errorFeedback}>{errors.email}</div>
                      )}
                    </Form.Group>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid || loading || isLoading}
                      className={style.submitButton}
                    >
                      {(loading || isLoading) ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Reset Code</span>
                          <ChevronRight size={18} className={style.buttonIcon} />
                        </>
                      )}
                    </Button>

                    <div className={style.backToLogin}>
                      <NavLink to="/login" className={style.backToLoginLink}>
                        <ArrowLeft size={16} />
                        <span>Back to Login</span>
                      </NavLink>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            
            {/* Back side of card (loading animation) */}
            <div className={style.cardBack}>
              <div className={style.loadingContainer}>
                <div className={style.loadingCircle}></div>
                <p>Sending verification code...</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}