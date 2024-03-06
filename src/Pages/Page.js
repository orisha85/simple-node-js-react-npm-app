// Page.js
import React from 'react';

function Page({ collapsed, children }) {
  return (
    <div
      style={{
        marginLeft: collapsed ? '80px' : '270px', // Adjust these values as needed
        transition: 'margin-left 0.3s ease',
        padding: '12px', // Adjust padding as needed
        overflowY: 'auto', // Change to 'auto' to make it scrollable
        boxSizing: 'border-box',
        maxHeight: 'calc(100vh - 41.59px)', // Set the maximum height of the page
      }}
    >
      {children}
    </div>
  );
}

export default Page;
