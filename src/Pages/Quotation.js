import React from 'react';
import { IoIosConstruct } from "react-icons/io";

const UnderConstructionPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <h1>Page Under Construction</h1>
      <IoIosConstruct style={{ width: '100px', height: '100px' }} />
    </div>
  );
};

export default UnderConstructionPage;
