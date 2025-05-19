import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaRegClock, FaTimesCircle, FaArrowRight, FaHeart, FaStar } from 'react-icons/fa';
import { BiDonateHeart } from 'react-icons/bi';

const DonationCard = ({ donation, onDonateClick }) => {
const [isButtonHovered, setIsButtonHovered] = useState(false);
  const isOpen = donation.status === 'open';
  const [particles, setParticles] = useState([]);
  
  
  const colors = {
    primary: isOpen ? '#5b8af9' : '#9e9e9e',
    secondary: isOpen ? '#a2c0ff' : '#d1d1d1',
    background: isOpen ? '#f8faff' : '#f5f5f5',
    text: '#4a5568',
    muted: '#718096'
  };
  
  // Array of vibrant colors for particles
  const particleColors = [
    '#FF5E62', // red
    '#5b8af9', // blue
    '#38EF7D', // green
    '#FFD700', // gold
    '#FF9966', // orange
    '#6A11CB', // purple
    '#FF4500', // orange red
    '#1E90FF', // dodger blue
    '#FF1493', // deep pink
  ];
  
  // Generate random particles (hearts and stars)
  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // random position
        y: Math.random() * 100,
        size: Math.random() * 10 + 5, // random size
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        duration: Math.random() * 3 + 2, // random animation duration
        delay: Math.random() * 2,
        type: Math.random() > 0.5 ? 'heart' : 'star', // randomly choose heart or star
        path: [
          // Random movement path
          [Math.random() * 20 - 10, Math.random() * 20 - 10],
          [Math.random() * 20 - 10, Math.random() * 20 - 10],
          [Math.random() * 20 - 10, Math.random() * 20 - 10],
        ]
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 15 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="h-100 position-relative"
    >
      {/* Animated particles (hearts and stars) */}
      {isOpen && particles.map(particle => (
        <motion.div
          key={particle.id}
          className="position-absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
            color: particle.color,
            zIndex: 5,
            pointerEvents: 'none',
            opacity: 0
          }}
          animate={{
            x: particle.path.map(p => p[0]),
            y: particle.path.map(p => p[1]),
            rotate: [0, 180, 360],
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        >
          {particle.type === 'heart' ? <FaHeart /> : <FaStar />}
        </motion.div>
      ))}

      <Card 
        className="h-100 border-0 shadow-sm overflow-hidden" 
        style={{ 
          maxWidth: '280px', 
          margin: '0 auto',
          borderRadius: '12px',
          background: colors.background
        }}
      >
        {/* Status indicator */}
        <div className="position-relative">
          <div className="d-flex align-items-center p-3">
            <Badge 
              pill 
              bg={isOpen ? "primary" : "secondary"}
              className="opacity-75 me-2"
              style={{ 
                background: colors.primary,
                fontSize: '0.65rem',
                fontWeight: '600'
              }}
            >
              {isOpen ? 'OPEN' : 'CLOSED'}
            </Badge>
            <small className="text-muted ms-auto" style={{ fontSize: '0.7rem', color: colors.muted }}>
              {donation.donationCode}
            </small>
          </div>
        </div>

        <Card.Body className="p-3 d-flex flex-column">
          {/* Title */}
          <Card.Title 
            className="mb-3 fw-bold" 
            style={{ 
              fontSize: '1rem', 
              color: colors.text,
              lineHeight: '1.3'
            }}
          >
            {donation.description.substring(0, 40)}...
          </Card.Title>
          
          {/* Amount circle */}
          <div className="text-center my-3 position-relative">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle p-1"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                boxShadow: `0 4px 15px rgba(91, 138, 249, 0.2)`
              }}
            >
              <div 
                className="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center"
                style={{ width: '90px', height: '90px' }}
              >
                <div 
                  className="fw-bold" 
                  style={{ 
                    fontSize: '1.1rem', 
                    color: colors.primary 
                  }}
                >
                  ${donation.amount.toLocaleString()}
                </div>
                <div 
                  style={{ 
                    fontSize: '0.65rem', 
                    color: colors.muted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Target
                </div>
              </div>
            </div>
            
            {/* Mini floating particles around the circle */}
            {isOpen && (
              <>
                <motion.div
                  className="position-absolute"
                  style={{
                    top: '0',
                    right: '30%',
                    fontSize: '10px',
                    color: particleColors[0],
                    zIndex: 2
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <FaHeart />
                </motion.div>
                <motion.div
                  className="position-absolute"
                  style={{
                    bottom: '10%',
                    left: '25%',
                    fontSize: '12px',
                    color: particleColors[2],
                    zIndex: 2
                  }}
                  animate={{
                    y: [0, 10, 0],
                    opacity: [0.7, 1, 0.7],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                >
                  <FaStar />
                </motion.div>
                <motion.div
                  className="position-absolute"
                  style={{
                    top: '30%',
                    left: '15%',
                    fontSize: '8px',
                    color: particleColors[4],
                    zIndex: 2
                  }}
                  animate={{
                    x: [0, -10, 0],
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                >
                  <FaHeart />
                </motion.div>
              </>
            )}
          </div>
          
          {/* Button */}
          


<motion.div
  whileHover={{ scale: isOpen ? 1.03 : 1 }}
  whileTap={{ scale: isOpen ? 0.97 : 1 }}
  onHoverStart={() => setIsButtonHovered(true)}
  onHoverEnd={() => setIsButtonHovered(false)}
  style={{ width: '100%' }}
>
  <Button
    variant={isOpen ? "primary" : "secondary"}
    className="w-100 rounded-pill mt-2 mb-3"
    onClick={() => onDonateClick(donation)}
    disabled={!isOpen}
    style={{ 
      background: isOpen 
        ? (isButtonHovered ? 'linear-gradient(135deg, #5b8af9, #3a6cf5)' : colors.primary) 
        : colors.secondary,
      border: 'none',
      padding: '0.5rem 1rem',
      fontSize: '0.9rem',
      fontWeight: '600',
      boxShadow: isOpen 
        ? (isButtonHovered ? '0 6px 15px rgba(91, 138, 249, 0.4)' : '0 4px 12px rgba(91, 138, 249, 0.25)') 
        : 'none',
      transition: 'all 0.3s ease'
    }}
  >
    <div className="d-flex align-items-center justify-content-center position-relative">
      {isOpen ? (
        <>
          <BiDonateHeart className="me-2" />
          <span>Donate</span>
          <motion.div
            className="ms-2"
            animate={{ 
              x: isButtonHovered ? [0, 8, 0] : [0, 5, 0],
              transition: { 
                duration: isButtonHovered ? 1 : 1.5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }
            }}
          >
            <FaArrowRight />
          </motion.div>
        </>
      ) : (
        <>
          <FaTimesCircle className="me-2" />
          <span>Closed</span>
        </>
      )}
    </div>
  </Button>
</motion.div>

          
          {/* Date at bottom */}
          <div 
            className="d-flex align-items-center justify-content-center mt-auto"
            style={{ fontSize: '0.75rem', color: colors.muted }}
          >
            <FaRegClock className="me-1" />
            <span>{new Date(donation.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default DonationCard;
