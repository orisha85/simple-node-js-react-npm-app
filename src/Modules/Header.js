import React from 'react';
import logo from '../pics/SMC_logo_border.png';

const Header = ({ title }) => {
  const headerStyle = {
    backgroundColor: '#333441',
    color: '#fff',
    padding: '10px', // Reduced padding
    textAlign: 'left', // Left-aligned text
    position: 'relative', // Position relative for absolute positioning of logo
  };

  const titleStyle = {
    fontSize: '18px', // Smaller font size
    margin: '0', // Remove default margin
  };

  const logoStyle = {
    position: 'absolute',
    top: '2px', // Adjust top position as needed
    right: '10px', // Adjust right position as needed
    width: '80px', // Set the desired width for your logo
    height: 'auto', // Maintain aspect ratio
    userSelect: 'none', // Disable text selection
    opacity: '0.9', // Set opacity to 50%
  };

  return (
    <div style={headerStyle}>
      <h1 style={titleStyle}>{title}</h1>
      <img src={logo} alt="Logo" style={logoStyle} />
    </div>
  );
};

export default Header;
