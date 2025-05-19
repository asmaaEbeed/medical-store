import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'default';
  });
  
  // Initialize navPosition from localStorage or default
  const [navPosition, setNavPosition] = useState(() => {
    return localStorage.getItem('navPosition') || 'relative';
  });

  // Apply theme when it changes
  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Apply nav position when it changes
  useEffect(() => {
    // Set the nav-position attribute on the body element
    document.body.setAttribute('data-nav-position', navPosition);
    localStorage.setItem('navPosition', navPosition);
  }, [navPosition]);

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
  };

  const changeNavPosition = (position) => {
    setNavPosition(position);
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      changeTheme, 
      navPosition, 
      changeNavPosition 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
