import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import { donationAPI } from '../../services/api/donation.api.js';
import {
  FaCheck,
  FaMoneyBillWave,
  FaPills,
  FaInfoCircle,
  FaWhatsapp,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaCreditCard,
  FaLock,
  FaHandHoldingMedical,
  FaTimes,
  FaHandHoldingHeart,
} from 'react-icons/fa';
import { BiDonateHeart } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import './DonationChatbot.css'; // You'll need to create this CSS file
import { useNavigate } from 'react-router-dom';

const DonationChatbot = ({ donation }) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('options');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const modalRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !event.target.closest('.float-donate-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDonate = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setCurrentStep('options');
    setContactInfo({ name: '', email: '', phone: '' });
    setMessage('');
    setError('');
    setSuccess(false);
    setSelectedAmount('');
    setCustomAmount('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };

  const handleCustomAmountSubmit = () => {
    if (!customAmount || isNaN(customAmount) || parseFloat(customAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setSelectedAmount(customAmount);
    setError('');
  };

  const handleMoneyDonation = async () => {
    if (!selectedAmount) {
      setError('Please select an amount');
      return;
    }
    
    setLoading(true);
    setError('');
    
    if (!contactInfo.email) {
      setError('Email is required.');
      setLoading(false);
      return;
    }
    
    try {
      // First create a donation record
        const paymentResponse = await donationAPI.donationPayment({
          email: contactInfo.email,
          amount: parseFloat(selectedAmount),
        });

        if (paymentResponse.data?.url) {
          window.location.href = paymentResponse.data.url;
        } else {
          throw new Error("Payment URL not received");
        }
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.response?.data?.message || "Failed to process donation.");
      setLoading(false);
    }
  };

  const handleMedicineDonation = () => {
    setLoading(true);
    setError('');
    if (!contactInfo.name || !contactInfo.phone || !message) {
      setError('Please fill all fields.');
      setLoading(false);
      return;
    }
    
    // Create donation message for WhatsApp
    const donationCode = donation ? donation.donationCode : 'General Donation';
    const whatsappMessage = encodeURIComponent(
      `Hello, I want to donate medicine or medical supplies.\nName: ${contactInfo.name}\nPhone: ${contactInfo.phone}\nDetails: ${message}\nDonation Code: ${donationCode}`
    );
    
    const pharmacyPhone = "201234567890"; // Replace with your actual pharmacy phone
    window.open(
      `https://wa.me/${pharmacyPhone}?text=${whatsappMessage}`,
      "_blank"
    );
    
    setSuccess(true);
    setCurrentStep('success');
    setLoading(false);
  };

  const renderOptions = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="d-flex justify-content-between align-items-center p-3 float-donate-header border-bottom">
        <h6 className="mb-0 d-flex align-items-center">
          <BiDonateHeart className="me-2" /> Donation Options
        </h6>
        <button 
          className="btn btn-sm p-0 text-secondary border-0"
          onClick={toggleDonate}
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="float-donate-body p-3">
        <motion.div variants={itemVariants} className="text-center mb-3">
          <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2" 
               style={{ 
                 width: "60px", 
                 height: "60px", 
                 background: 'linear-gradient(135deg, #0E1A3A, #0E1A3A)',
                 boxShadow: '0 4px 10px rgba(106, 17, 203, 0.3)'
               }}>
            <BiDonateHeart className="text-white" style={{ fontSize: '30px' }} />
          </div>
        </motion.div>
        
        
        <motion.div variants={itemVariants}>
          <div className="mb-3">
            <div
              onClick={() => setCurrentStep('money')}
              className="border-0 shadow-sm rounded-3 mb-2 cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div className="p-2">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-2 d-flex align-items-center justify-content-center" 
                       style={{ width: '40px', height: '40px' }}>
                    <FaMoneyBillWave className="text-warning" />
                  </div>
                  <div>
                    <div className="d-flex align-items-baseline flex-wrap">
                      <h6 className="mb-0 me-1">Donate Money</h6>
                      <span className="text-muted small">Support with financial aid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div
              onClick={() => setCurrentStep('medicine')}
              className="border-0 shadow-sm rounded-3 cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div className="p-2">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-success bg-opacity-10 p-2 me-2 d-flex align-items-center justify-content-center" 
                       style={{ width: '40px', height: '40px' }}>
                    <FaPills className="text-success" />
                  </div>
                  <div>
                    <div className="d-flex align-items-baseline flex-wrap">
                      <h6 className="mb-0 me-1">Donate Medicine</h6>
                      <span className="text-muted small">Provide medical supplies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center mt-3">
        {/* <Button 
  variant="link" 
  className="btn-sm p-0 text-decoration-none"
  onClick={() => navigate('/donation')}
>
  <span>View all donation cases</span>
  <FaArrowRight className="ms-1 small" />
</Button> */}

<Link
  to="/donation"
  className="btn btn-link btn-sm p-0 text-decoration-none"
>
  <span>View all donation cases</span>
  <FaArrowRight className="ms-1 small" />
</Link>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderMoneyForm = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="float-donate-header">
        <h6 className="mb-0 d-flex align-items-center">
          <FaMoneyBillWave className="me-2 text-warning" /> Donate Money
        </h6>
        <button 
          className="close-button" 
          onClick={toggleDonate}
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="float-donate-body p-3">
        <motion.div variants={itemVariants}>
          <h6 className="mb-2 text-center">Select an amount</h6>
          
          <div className="row row-cols-4 g-2 mb-2">
            {['10', '20', '50', '100'].map(amount => (
              <div className="col" key={amount}>
                <div 
                  className={` cursor-pointer ${selectedAmount === amount ? 'border-primary' : 'border-light'}`}
                  onClick={() => handleAmountSelect(amount)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center justify-content-center p-2">
                    <span className="fs-5 fw-bold">${amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-light rounded p-2 mb-3">
            <div className="d-flex">
              <InputGroup size="sm">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </InputGroup>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleCustomAmountSubmit}
                className="ms-2"
                disabled={!customAmount || isNaN(customAmount) || parseFloat(customAmount) <= 0}
              >
                <FaArrowRight />
              </Button>
            </div>
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label className="small d-flex align-items-center">
              <FaLock className="me-1 text-muted" /> Email address
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={contactInfo.email}
              onChange={handleInputChange}
              required
              size="sm"
              placeholder="email"
              className="rounded-3"
            />
          </Form.Group>
          
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          
          <div className="d-flex mt-3">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setCurrentStep('options')}
              className="me-2 d-flex align-items-center"
            >
              <FaArrowLeft className="me-1" /> Back
            </Button>
            <Button 
              variant="success" 
              size="sm"
              onClick={handleMoneyDonation}
              disabled={loading || !selectedAmount || !contactInfo.email}
              className="flex-grow-1 d-flex align-items-center justify-content-center"
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <FaCreditCard className="me-1" /> Proceed to Payment
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderMedicineForm = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="float-donate-header">
        <h6 className="mb-0 d-flex align-items-center">
          <FaPills className="me-2 text-success" /> Donate Medicine
        </h6>
        <button 
          className="close-button" 
          onClick={toggleDonate}
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="float-donate-body p-3">
        <motion.div variants={itemVariants}>
          <Form>
            <Row className="mb-2">
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Name</Form.Label>
                  <Form.Control
                    size="sm"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Phone</Form.Label>
                  <Form.Control
                    size="sm"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="small">Medicine details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Please specify medicine name, quantity, etc."
                value={message}
                onChange={handleMessageChange}
                required
                size="sm"
              />
            </Form.Group>
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            
            <div className="d-flex mt-3">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setCurrentStep('options')}
                className="me-2 d-flex align-items-center"
              >
                <FaArrowLeft className="me-1" /> Back
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={handleMedicineDonation}
                disabled={loading}
                className="flex-grow-1 d-flex align-items-center justify-content-center"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <FaWhatsapp className="me-1" /> Send via WhatsApp
                  </>
                )}
              </Button>
            </div>
          </Form>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="float-donate-header">
        <h6 className="mb-0 d-flex align-items-center">
          <FaCheckCircle className="me-2 text-success" /> Thank You
        </h6>
        <button 
          className="close-button" 
          onClick={toggleDonate}
        >
          <FaTimes />
        </button>
      </div>
      
      <div className="float-donate-body text-center p-3">
        <motion.div variants={itemVariants}>
          <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
               style={{ width: "60px", height: "60px" }}>
            <FaCheck className="text-white fs-4" />
          </div>
          <h6 className="mb-2">Thank you for your support!</h6>
          <p className="text-muted small mb-3">Your generosity helps save lives.</p>
          
          <div className="d-flex flex-column align-items-center gap-2">
            <Button 
              variant= "outline-secondary"
              size="sm"
              onClick={resetForm}
              className="w-75"
            >
              Make Another Donation
            </Button>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderModalContent = () => {
    switch (currentStep) {
      case 'options':
        return renderOptions();
      case 'money':
        return renderMoneyForm();
      case 'medicine':
        return renderMedicineForm();
      case 'success':
        return renderSuccess();
      // case 'fullConditions':
      //   return renderFullConditions();
      default:
        return renderOptions();
    }
  };

  return (
    <div className="position-fixed" style={{ bottom: '20px', left: '10px', zIndex: 999 }}>
      {/* Floating Donate Button */}
      <motion.div
        className="btn donate-button-wrapper rounded-circle shadow d-flex align-items-center justify-content-center"
        style={{ 
          width: '60px', 
          height: '60px', 
          background: 'linear-gradient(135deg, #0E1A3A, #0E1A3A)',
          border: 'none',
          padding: '5px',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDonate}
      >
        <FaHandHoldingHeart size={32} className="text-white" />
      </motion.div>
      
      {/* Donation Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="position-absolute shadow rounded-4 bg-white overflow-hidden"
            style={{ 
              bottom: '80px',
              left: '0', 
              width: '300px',
              zIndex: 1050
            }}
            ref={modalRef}
          >
            {renderModalContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



export default DonationChatbot;
