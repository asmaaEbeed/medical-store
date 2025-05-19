import { useContext, useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Button, Form, Spinner } from 'react-bootstrap';
import { Mail, Lock, User, ChevronRight, ArrowLeft, Sparkles } from "lucide-react";
import logo from "../../assets/images/Logo_light.png";
import style from './SignUp.module.css';
import UserContext from '../../shop/UserContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useContext(UserContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    firstName: Yup.string()
      .min(4, 'First name must be at least 4 characters')
      .max(15, 'First name cannot exceed 15 characters')
      .required('First name is required'),
    lastName: Yup.string()
      .min(4, 'Last name must be at least 4 characters')
      .max(15, 'Last name cannot exceed 15 characters')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
      .required('Password is required'),
    cpassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
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

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setIsCardFlipped(true);
      
      const userData = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      };
      
      console.log('Sending registration data:', userData);
      await register(userData); 
      toast.success('Registration successful!');
      resetForm();
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(error || 'Registration failed!');
      setIsCardFlipped(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={style.signupPage}>
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
            className={`${style.signupCard} ${isCardFlipped ? style.flipped : ''}`} 
            style={getCardStyle()}
          >
            {/* Front side of card (signup form) */}
            <div className={style.cardFront}>
              <div className={style.cardHeader}>
                <h2>
                  <span className={style.titleText}>Create Account</span>
                  <Sparkles className={style.sparkleIcon} size={20} />
                </h2>
                <p>Join our community and start shopping</p>
              </div>
              
              <Formik
                initialValues={{ firstName: '', lastName: '', email: '', password: '', cpassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, isSubmitting }) => (
                  <Form onSubmit={handleSubmit} className={style.signupForm}>
                    {error && <div className={style.errorMessage}>{error}</div>}

                    <div className={style.nameFieldsContainer}>
                      <Form.Group className={style.formGroup}>
                        <div 
                          className={`${style.inputWithIcon} ${activeField === 'firstName' ? style.inputActive : ''}`}
                          onClick={() => document.getElementById('firstName-field').focus()}
                        >
                          <div className={style.inputIconWrapper}>
                            <User size={18} className={style.inputIcon} />
                          </div>
                          <Form.Control
                            id="firstName-field"
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={(e) => {
                              handleBlur(e);
                              setActiveField(null);
                            }}
                            onFocus={() => setActiveField('firstName')}
                            className={style.formControl}
                            isInvalid={touched.firstName && errors.firstName}
                          />
                        </div>
                        {touched.firstName && errors.firstName && (
                          <div className={style.errorFeedback}>{errors.firstName}</div>
                        )}
                      </Form.Group>

                      <Form.Group className={style.formGroup}>
                        <div 
                          className={`${style.inputWithIcon} ${activeField === 'lastName' ? style.inputActive : ''}`}
                          onClick={() => document.getElementById('lastName-field').focus()}
                        >
                          <div className={style.inputIconWrapper}>
                            <User size={18} className={style.inputIcon} />
                          </div>
                          <Form.Control
                            id="lastName-field"
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={(e) => {
                              handleBlur(e);
                              setActiveField(null);
                            }}
                            onFocus={() => setActiveField('lastName')}
                            className={style.formControl}
                            isInvalid={touched.lastName && errors.lastName}
                          />
                        </div>
                        {touched.lastName && errors.lastName && (
                          <div className={style.errorFeedback}>{errors.lastName}</div>
                        )}
                      </Form.Group>
                    </div>

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
                          placeholder="Email address"
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
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={(e) => {
                            handleBlur(e);
                            setActiveField(null);
                          }}
                          onFocus={() => setActiveField('password')}
                          className={style.formControl}
                          isInvalid={touched.password && errors.password}
                        />
                        <div
                          className={style.passwordToggle}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
                            : 
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          }
                        </div>
                      </div>
                      {touched.password && errors.password && (
                        <div className={style.errorFeedback}>{errors.password}</div>
                      )}
                    </Form.Group>

                    <Form.Group className={style.formGroup}>
                      <div 
                        className={`${style.inputWithIcon} ${activeField === 'cpassword' ? style.inputActive : ''}`}
                        onClick={() => document.getElementById('cpassword-field').focus()}
                      >
                        <div className={style.inputIconWrapper}>
                          <Lock size={18} className={style.inputIcon} />
                          </div>
                        <Form.Control
                          id="cpassword-field"
                          type={showConfirmPassword ? "text" : "password"}
                          name="cpassword"
                          placeholder="Confirm Password"
                          value={values.cpassword}
                          onChange={handleChange}
                          onBlur={(e) => {
                            handleBlur(e);
                            setActiveField(null);
                          }}
                          onFocus={() => setActiveField('cpassword')}
                          className={style.formControl}
                          isInvalid={touched.cpassword && errors.cpassword}
                        />
                        <div
                          className={style.passwordToggle}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                        >
                          {showConfirmPassword ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
                            : 
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          }
                        </div>
                      </div>
                      {touched.cpassword && errors.cpassword && (
                        <div className={style.errorFeedback}>{errors.cpassword}</div>
                      )}
                    </Form.Group>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid || isLoading}
                      className={style.submitButton}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ChevronRight size={18} className={style.buttonIcon} />
                        </>
                      )}
                    </Button>

                    <div className={style.loginPrompt}>
                      <span>Already have an account? </span>
                      <NavLink to="/login" className={style.loginLink}>
                        Log in here
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
                <p>Creating your account...</p>
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
};

export default SignUp;
