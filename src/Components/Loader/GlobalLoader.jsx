import React, { useState, useEffect, useRef } from 'react';
import './loader.css';

const GlobalLoader = ({ isVisible }) => {
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState(isVisible ? 'flex' : 'none');
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isVisible) {
      // Show loader immediately
      setDisplay('flex');
      setOpacity(1);
    } else {
      // Start fade out
      setOpacity(0);
      
      // After fade out completes, set display to none
      timeoutRef.current = setTimeout(() => {
        setDisplay('none');
      }, 1000); // Match this with the CSS transition duration
    }
    
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);
  
  return (
    <div data-testid="global-loader"
      className="global-loader-container" 
      style={{ 
        opacity: opacity,
        display: display,
        transition: 'opacity 1s ease-out'
      }}
    >
      <div className="global-fancy-loader">
        <div className="medical-cross">
          <div className="cross-horizontal"></div>
          <div className="cross-vertical"></div>
          <div className="cross-pulse"></div>
        </div>
        
        <div className="dna-helix">
          <div className="dna-strand strand-1"></div>
          <div className="dna-strand strand-2"></div>
          <div className="dna-strand strand-3"></div>
          <div className="dna-strand strand-4"></div>
          <div className="dna-strand strand-5"></div>
          <div className="dna-strand strand-6"></div>
        </div>
        
        <div className="pill pill-1"></div>
        <div className="pill pill-2"></div>
        <div className="pill pill-3"></div>
        <div className="pill pill-4"></div>
        <div className="pill pill-5"></div>
        
        <div className="loader-text-container">
          <div className="loader-text">
            <span>P</span>
            <span>r</span>
            <span>e</span>
            <span>p</span>
            <span>a</span>
            <span>r</span>
            <span>i</span>
            <span>n</span>
            <span>g</span>
            <span>&nbsp;</span>
            <span>y</span>
            <span>o</span>
            <span>u</span>
            <span>r</span>
            <span>&nbsp;</span>
            <span>e</span>
            <span>x</span>
            <span>p</span>
            <span>e</span>
            <span>r</span>
            <span>i</span>
            <span>e</span>
            <span>n</span>
            <span>c</span>
            <span>e</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
