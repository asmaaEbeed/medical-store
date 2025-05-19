import { useContext, useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Button, Form, Spinner } from 'react-bootstrap';
import { Mail, Lock, ChevronRight, ArrowLeft, Sparkles, KeyRound } from "lucide-react";
import logo from "../../assets/images/Logo_light.png";
import style from './ResetPassword.module.css';
import { UserContext } from '../../shop/UserContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, resetPassword } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [email, setEmail] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

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
    forgetCode: Yup.string()
      .required('Verification code is required')
      .min(6).max(6, 'Invalid code'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
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
      const res = await resetPassword(email, values.forgetCode, values.newPassword);
      console.log(res);
      toast.success('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Error resetting password:', err);
      const errorMessage = err.response?.data?.error || 'Failed to reset password';
      setRequestError(errorMessage);
      toast.error(errorMessage);
      setIsCardFlipped(false);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className={style.resetPasswordPage}>
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
            className={`${style.resetPasswordCard} ${isCardFlipped ? style.flipped : ''}`} 
            style={getCardStyle()}
          >
            {/* Front side of card (reset password form) */}
            <div className={style.cardFront}>
              <div className={style.cardHeader}>
                <h2>
                  <span className={style.titleText}>Reset Password</span>
                  <Sparkles className={style.sparkleIcon} size={20} />
                </h2>
                <p>Enter the verification code sent to your email and create a new password.</p>
              </div>
              
              <Formik
                initialValues={{ forgetCode: '', newPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, isSubmitting }) => (
                  <Form onSubmit={handleSubmit} className={style.resetPasswordForm}>
                    {(requestError || error) && <div className={style.errorMessage}>{requestError || error}</div>}

                    <div className={style.emailDisplay}>
                      <Mail size={18} className={style.emailIcon} />
                      <span>{email || 'No email provided'}</span>
                    </div>

                    <Form.Group className={style.formGroup}>
                      <div 
                        className={`${style.inputWithIcon} ${activeField === 'code' ? style.inputActive : ''}`}
                        onClick={() => document.getElementById('code-field').focus()}
                      >
                        <div className={style.inputIconWrapper}>
                          <KeyRound size={18} className={style.inputIcon} />
                        </div>
                        <Form.Control
                          id="code-field"
                          type="text"
                          name="forgetCode"
                          placeholder="Enter verification code"
                          value={values.forgetCode}
                          onChange={handleChange}
                          onBlur={(e) => {
                            handleBlur(e);
                            setActiveField(null);
                          }}
                          onFocus={() => setActiveField('code')}
                          className={style.formControl}
                          isInvalid={touched.forgetCode && errors.forgetCode}
                        />
                      </div>
                      {touched.forgetCode && errors.forgetCode && (
                        <div className={style.errorFeedback}>{errors.forgetCode}</div>
                      )}
                    </Form.Group>

                    <Form.Group className={style.formGroup}>
                      <div 
                        className={`${style.inputWithIcon} ${activeField === 'password' ? style.inputActive : ''}`}
                        onClick={() => document.getElementById('password-field').focus()}
                      >
                        <div className={style.inputIconWrapper}>
                          <Lock size={18} className={style.inputIcon} />
                        </div>
                        <Form.Control
                          id="password-field"
                          type="password"
                          name="newPassword"
                          placeholder="Enter new password"
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={(e) => {
                            handleBlur(e);
                            setActiveField(null);
                          }}
                          onFocus={() => setActiveField('password')}
                          className={style.formControl}
                          isInvalid={touched.newPassword && errors.newPassword}
                        />
                      </div>
                      {touched.newPassword && errors.newPassword && (
                        <div className={style.errorFeedback}>{errors.newPassword}</div>
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
                          <span>Resetting...</span>
                        </>
                      ) : (
                        <>
                          <span>Reset Password</span>
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
                <p>Resetting your password...</p>
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
