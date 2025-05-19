import React, { useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
  Badge,
} from 'react-bootstrap';
import {donationAPI} from '../../services/api/donation.api.js';
import {
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
  FaRegClock,
  FaRegCheckCircle,
} from 'react-icons/fa';
import { BiDonateHeart } from 'react-icons/bi';
import { motion } from 'framer-motion';

const DonationModal = ({ show, handleClose, donation, onSubmit }) => {
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

  // const API_BASE_URL = 'http://localhost:5000';

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

  const resetForm = () => {
    setCurrentStep('options');
    setContactInfo({ name: '', email: '', phone: '' });
    setMessage('');
    setError('');
    setSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleMoneyDonation = async () => {
    setLoading(true);
    setError('');
    if (!contactInfo.email) {
      setError('Email is required.');
      setLoading(false);
      return;
    }
    try {
      if (onSubmit) {
        await onSubmit({
          email: contactInfo.email,
          amount: parseFloat(donation.amount),
        });
      } else {
        const response = await donationAPI.donationPayment(
          {
            email: contactInfo.email,
            amount: parseFloat(donation.amount),
            donateId: donation._id,
          }
        );
        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error("Payment URL not received");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process donation.");
    } finally {
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
    const whatsappMessage = encodeURIComponent(
      `Hello, I want to donate for case ${donation.donationCode}.\nName: ${contactInfo.name}\nPhone: ${contactInfo.phone}\nDetails: ${message} `
    );
    const pharmacyPhone = "201234567890";
    window.open(
      `https://wa.me/${pharmacyPhone}?text=${whatsappMessage}`,
      "_blank"
    );
    setSuccess(true);
    setCurrentStep('success');
    setLoading(false);
  };

  const handleClose2 = () => {
    resetForm();
    handleClose();
  };

  // Render donation conditions section
  const renderConditions = () => (
    <Card className="border-0 shadow-sm mb-4 bg-light">
      <Card.Body>
        <h5 className="mb-3 text-primary d-flex align-items-center">
          <FaInfoCircle className="me-2" /> Donation Conditions
        </h5>
        
        <Row className="g-3 mb-3">
          <Col md={4}>
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                <FaLock className="text-primary" />
              </div>
              <div className="small">Your information is confidential</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-2 me-2">
                <FaHandHoldingMedical className="text-success" />
              </div>
              <div className="small">Medicines must not be expired</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-2">
                <FaRegClock className="text-warning" />
              </div>
              <div className="small">Distributed within 48 hours</div>
            </div>
          </Col>
        </Row>
        
        <div className="text-center">
          <Button 
            variant="link" 
            size="sm" 
            className="text-decoration-none"
            onClick={() => setCurrentStep('fullConditions')}
          >
            View all conditions <FaArrowRight className="ms-1" size={10} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const renderOptions = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-primary d-flex align-items-center">
          <BiDonateHeart className="me-2" /> 
          <span>Donate to Case: {donation.donationCode}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <motion.div variants={itemVariants}>
          <Card className="mb-4 bg-light border-0 shadow-sm">
            <Card.Body>
              <h5 className="text-primary">Case Details</h5>
              <p>{donation.description}</p>
              <Badge 
                bg="warning" 
                className="px-3 py-2"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FF9966)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
                }}
              >
                Target Amount: ${donation.amount}
              </Badge>
            </Card.Body>
          </Card>
        </motion.div>
        
        {renderConditions()}
        
        <motion.div variants={itemVariants} className="mb-4 py-3 px-4 bg-light border-0 shadow-sm">
          <h5 className="text-center mb-4">Choose Donation Type</h5>
          <Row xs={1} md={2} className="g-3">
            <Col>
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Card
                  onClick={() => setCurrentStep('medicine')}
                  className="text-center p-3 border-0 shadow h-100 cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                    <FaPills size={30} className="text-success" />
                  </div>
                  <Card.Title>Via whatsapp</Card.Title>
                </Card>
              </motion.div>
            </Col>
            <Col>
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Card
                  onClick={() => setCurrentStep('money')}
                  className="text-center p-3 border-0 shadow h-100"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
                    <FaMoneyBillWave size={30} className="text-warning" />
                  </div>
                  <Card.Title>via Visa</Card.Title>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </Modal.Body>
    </motion.div>
  );

  const renderFullConditions = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-primary d-flex align-items-center">
          <FaInfoCircle className="me-2" /> 
          <span>Donation Conditions</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0 d-flex align-items-center py-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <FaCheckCircle className="text-primary" />
                  </div>
                  <div>Donations must comply with local regulations and laws</div>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center py-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <FaCheckCircle className="text-primary" />
                  </div>
                  <div>All donations are tax-deductible</div>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center py-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <FaCheckCircle className="text-primary" />
                  </div>
                  <div>You will receive a receipt for your donation</div>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center py-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <FaCheckCircle className="text-primary" />
                  </div>
                  <div>Your information will be kept confidential</div>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center py-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <FaCheckCircle className="text-primary" />
                  </div>
                  <div>Medicines must not be expired and must be in original packaging</div>
                </li>
                <li className="list-group-item border-0 d-flex align-items-center py-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                    <FaCheckCircle className="text-primary" />
                  </div>
                  <div>We reserve the right to refuse donations that don't meet our criteria</div>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </motion.div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button 
          variant="primary" 
          onClick={() => setCurrentStep('options')}
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" /> Back to Options
        </Button>
      </Modal.Footer>
    </motion.div>
  );

  const renderMoneyForm = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <FaMoneyBillWave className="me-2 text-warning" /> Donate Money
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm mb-4 text-center">
            <Card.Body>
              <h5 className="mb-2">Donation Amount</h5>
              <h2 className="display-4 text-warning mb-2">${donation.amount}</h2>
              <p className="mb-0">Case ID: <Badge bg="secondary">{donation.donationCode}</Badge></p>
            </Card.Body>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center">
                <FaLock className="me-2 text-muted" /> Email address
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={contactInfo.email}
                onChange={handleInputChange}
                required
                className="border-0 shadow-sm"
                placeholder="Enter your email for payment confirmation"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
          </Form>
        </motion.div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button 
          variant="outline-secondary" 
          onClick={() => setCurrentStep('options')}
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" /> Back
        </Button>
        <motion.div variants={itemVariants}>
          <Button 
            variant="success" 
            onClick={handleMoneyDonation}
            disabled={loading}
            className="w-100"
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Donate Now"
            )}
          </Button>
        </motion.div>
      </Modal.Footer>
    </motion.div>
  );

  const renderMedicineForm = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <FaPills className="me-2 text-success" /> Donate Medicine
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm mb-4 text-center">
            <Card.Body>
              <h5 className="mb-2">Donation Amount</h5>
              <h2 className="display-4 text-success mb-2">${donation.amount}</h2>
              <p className="mb-0">Case ID: <Badge bg="secondary">{donation.donationCode}</Badge></p>
            </Card.Body>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  placeholder="Name"
                  name="name"
                  value={contactInfo.name}
                  onChange={handleInputChange}
                  required
                  className="border-0 shadow-sm"
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Phone"
                  name="phone"
                  value={contactInfo.phone}
                  onChange={handleInputChange}
                  required
                  className="border-0 shadow-sm"
                />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Medicine details..."
                value={message}

                onChange={(e) => setMessage(e.target.value)}
                required
                className="border-0 shadow-sm"
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
          </Form>
        </motion.div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button 
          variant="outline-secondary" 
          onClick={() => setCurrentStep('options')}
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" /> Back
        </Button>
        <motion.div variants={itemVariants}>
          <Button
            variant="success"
            onClick={handleMedicineDonation}
            disabled={loading}
            className="w-100"
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (<>
              <FaWhatsapp/> Send via WhatsApp</>
            )}
          </Button>
        </motion.div>
      </Modal.Footer>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Modal.Body className="text-center">
        <FaCheckCircle size={60} className="text-success mb-3" />
        <h5>Thank you for your support!</h5>
        <Button variant="outline-primary" className="mt-3" onClick={handleClose2}>
          Close
        </Button>
      </Modal.Body>
    </motion.div>
  );

  const renderModalContent = () => {
    if (!donation) return null;

    switch (currentStep) {
      case 'options':
        return renderOptions();
      case 'money':
        return renderMoneyForm();
      case 'medicine':
        return renderMedicineForm();
      case 'success':
        return renderSuccess();
      case 'fullConditions':
        return renderFullConditions();
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={handleClose2} centered size="lg">
      {renderModalContent()}
    </Modal>
  );
};

export default DonationModal;
