import React from 'react';
import loadingGif from '../pics/loading.gif';

const LoadingIcon = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', height: '80vh' }}>
    <img src={loadingGif} alt="Loading" style={{ width: '50px', height: 'auto' }} />
  </div>
);

export default LoadingIcon;