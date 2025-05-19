import { useContext, useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Button, Form, Spinner } from 'react-bootstrap';
import { Eye, EyeOff, Mail, Lock, ChevronRight, Sparkles } from "lucide-react";
import logo from "../../assets/images/Logo_light.png";
import UserContext from '../../shop/UserContext';
import GoogleLoginButton from '../LoginByGmail/GoogleLoginButton';
import style from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, userToken } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (userToken) {
      const previousUrl = location.state?.from;
      if (previousUrl) {
        navigate(previousUrl);
      } else {
        navigate('/');
      }
    }
  }, [userToken, navigate, location]);

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
      .required('This field is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('This field is required'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // Flip card for loading animation
      setIsCardFlipped(true);
      
      const credentials = {
        email: values.email,
        password: values.password
      };
      
      await login(credentials);
      toast.success('Login successful!');
      resetForm();
      
      // Success animation
      setTimeout(() => {
        const previousUrl = location.state?.from;
        if (previousUrl) {
          navigate(previousUrl);
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (err) {
      console.error('Login error:', err);
      setIsCardFlipped(false);
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className={style.loginPage}>
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
            className={`${style.loginCard} ${isCardFlipped ? style.flipped : ''}`} 
            style={getCardStyle()}
          >
            {/* Front side of card (login form) */}
            <div className={style.cardFront}>
              <div className={style.cardHeader}>
                <h2>
                  <span className={style.welcomeText}>Welcome</span>
                  <Sparkles className={style.sparkleIcon} size={20} />
                </h2>
                <p>Sign in to your account</p>
              </div>
              
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, isSubmitting }) => (
                  <Form onSubmit={handleSubmit} className={style.loginForm}>
                    {error && <div className={style.errorMessage}>{error}</div>}

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
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                      </div>
                      {touched.password && errors.password && (
                        <div className={style.errorFeedback}>{errors.password}</div>
                      )}
                    </Form.Group>

                    <div className={style.forgotPassword}>
                      <NavLink to="/forgetpassword" className={`mx-2`}>Forgot Password?</NavLink>
                      <NavLink to="/signup">Or Sign Up</NavLink>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid || isLoading}
                      className={style.loginButton}
                    >
                      <span>Sign In</span>
                      <ChevronRight size={18} className={style.buttonIcon} />
                    </Button>

                    <div className={style.divider}>
                      <span>OR</span>
                    </div>

                    <div className={style.socialLogin}>
                      <GoogleLoginButton className={style.googleButton} />
                    </div>

                    <div className={style.signupPrompt}>
                      <span>Don't have an account? </span>
                      <NavLink to="/signup" className={style.signupLink}>Create one now</NavLink>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            
            {/* Back side of card (loading animation) */}
            <div className={style.cardBack}>
              <div className={style.loadingContainer}>
                <div className={style.loadingCircle}></div>
                <p>Signing you in...</p>
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

export default Login;
