import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Spinner, Image } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeroSection from './HeroSection.jsx';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { BiDonateHeart } from 'react-icons/bi';
import DonationModal from './DonationModal';
import DonationCard from './DonationCard';
import DonationConditions from './DonationConditions';
import {donationAPI} from '../../services/api/donation.api.js';
import './Donations.css';
import BreadCrumb from "../Common/BreadCrumb";


const DonationsList = () => {
  const breadCrumbData = [
    { name: "Home", link: "/" },
    { name: "Donation", link: "/donation" },
  ];
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await donationAPI.getAllDonation();
      if (response.data.donations) {
        setDonations(response.data?.donations);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load donations. Please try again later.');
      toast.error('Failed to load donations. Please try again later.');
      setLoading(false);
      console.error('Error fetching donations:', err);
    }
  };

  const handleDonateClick = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDonation(null);
  };

  const handleDonationSubmit = async (donationData) => {
    try {
      setLoading(true);
      const response = await donationAPI.donationPayment({
        donateId: selectedDonation._id,
        email: donationData.email,
        amount: donationData.amount
      });
      
      if (response.data.url) {
        toast.info('Redirecting to payment page...');
        window.location.href = response.data.url;
      }
      
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment process failed. Please try again.');
      setLoading(false);
    }
  };

  if (loading && donations.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="warning" role="status" className="my-5">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted">Loading donation cases...</p>
      </Container>
    );
  }

  if (error && donations.length === 0) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button variant="primary" onClick={fetchDonations} className="mt-3">
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <>
              <BreadCrumb breadCrumbData={breadCrumbData} />

    <Container fluid className="p-0 my-3">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      {/* Hero Section with Image */}
      <HeroSection />

          {/* Donation Conditions Section */}
          <DonationConditions />
      
      {/* Donation Cases Section */}
      <Container className="donations-container py-5" id="donation-cases">

        <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                  className="text-center mb-5"
                >
                  <h2 className="display-4 fw-bold mb-3">Current Donation Cases</h2>
                  <div className="mx-auto bg-primary opacity-75 mb-4" style={{ height: '4px', width: '80px', borderRadius: '2px' }}></div>
                  <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                  Your support can make a significant difference in these lives 
                  </p>
                </motion.div>
        
        {donations.length === 0 ? (
          <motion.div 
            className="text-center py-5 my-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="empty-state-icon mb-4">
              <BiDonateHeart size={60} className="text-muted" />
            </div>
            <h4 className="fw-bold">No donation cases available at the moment</h4>
            <p className="text-muted">Please check back later or contact us for more information</p>
            <Button variant="outline-primary" className="rounded-pill mt-3">Contact Us</Button>
          </motion.div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {donations.map((donation, index) => (
              <Col key={donation._id}>
                <DonationCard 
                  donation={donation} 
                  onDonateClick={handleDonateClick} 
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>


      <DonationModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        donation={selectedDonation}
        onSubmit={handleDonationSubmit}
      />
    </Container>
    </>
  );
};

export default DonationsList;
