import React from 'react';

const Footer = ({ children }) => {
  return (
    <footer style={{ 
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Use rgba to set opacity
      borderTop: '1px solid rgba(0, 0, 0, 0.2)', // Lighter black color
      zIndex: 1000 // Adjust the z-index as needed
    }}>
      {children}
    </footer>
  );
}

export default Footer;
