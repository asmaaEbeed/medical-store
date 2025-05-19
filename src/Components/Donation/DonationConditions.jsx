import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaHandHoldingMedical, 
  FaRegClock, 
  FaRegCheckCircle, 
  FaLock, 
  FaRegFileAlt 
} from 'react-icons/fa';

const DonationConditions = () => {
  const conditions = [
    {
      icon: <FaShieldAlt />,
      title: "Compliance",
      description: "All donations must comply with local regulations and laws",
      color: "linear-gradient(135deg, #FF9966, #FF5E62)"
    },
    {
      icon: <FaRegFileAlt />,
      title: "Tax Deductible",
      description: "All monetary donations are tax-deductible with receipt",
      color: "linear-gradient(135deg, #56CCF2, #2F80ED)"
    },
    {
      icon: <FaLock />,
      title: "Privacy",
      description: "Your personal information will be kept confidential",
      color: "linear-gradient(135deg, #6A11CB, #2575FC)"
    },
    {
      icon: <FaHandHoldingMedical />,
      title: "Medicine Quality",
      description: "Medicines must not be expired and in original packaging",
      color: "linear-gradient(135deg, #11998E, #38EF7D)"
    },
    {
      icon: <FaRegClock />,
      title: "Timely Distribution",
      description: "Donations are distributed to recipients within 48 hours",
      color: "linear-gradient(135deg, #F5515F, #9F041B)"
    },
    {
      icon: <FaRegCheckCircle />,
      title: "Quality Control",
      description: "We reserve the right to refuse donations that don't meet criteria",
      color: "linear-gradient(135deg, #654EA3, #EAAFC8)"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="py-5 bg-light">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-5"
        >
          <h2 className="display-4 fw-bold mb-3">Donation Guidelines</h2>
          <div className="mx-auto bg-primary opacity-75 mb-4" style={{ height: '4px', width: '80px', borderRadius: '2px' }}></div>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Our commitment to transparency and ethical donation practices ensures your contributions make the maximum impact
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Row className="g-4">
            {conditions.map((condition, index) => (
              <Col lg={4} md={6} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ 
                    y: -15,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="h-100"
                >
                  <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                    <Card.Body className="d-flex flex-column align-items-center text-center p-0">
                      {/* Icon with original styling preserved */}
                      <div 
                        className="d-flex align-items-center justify-content-center mb-4 position-relative"
                        style={{ 
                          width: '100px', 
                          height: '100px', 
                          background: condition.color,
                          borderRadius: '30px',
                          transform: 'rotate(45deg)',
                          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                          transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                      >
                        <div 
                          className="fs-1 text-white"
                          style={{
                            transform: 'rotate(-45deg)',
                            transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                          }}
                        >
                          {condition.icon}
                        </div>
                        <div 
                          className="position-absolute w-100 h-100"
                          style={{
                            background: 'inherit',
                            borderRadius: 'inherit',
                            filter: 'blur(20px)',
                            opacity: 0,
                            transition: 'opacity 0.5s ease',
                            zIndex: -1
                          }}
                        ></div>
                      </div>
                      
                      <h4 className="fw-bold mb-3">{condition.title}</h4>
                      <p className="text-muted mb-0">{condition.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>

      {/* Minimal CSS for hover effects */}
      <style jsx>{`
        .card:hover .d-flex[style*="rotate(45deg)"] {
          transform: rotate(0deg) scale(1.1);
        }
        
        .card:hover .d-flex[style*="rotate(45deg)"] > .fs-1 {
          transform: rotate(0deg) scale(1.2);
        }
        
        .card:hover .d-flex[style*="rotate(45deg)"] > div[style*="blur"] {
          opacity: 0.7;
        }
      `}</style>
    </section>
  );
};

export default DonationConditions;
