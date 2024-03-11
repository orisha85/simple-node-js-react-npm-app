import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { IoIosConstruct } from "react-icons/io";

const SettingsModal = ({ setShow, show }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClose = () => setShow(false);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
      fullscreen={isFullscreen}
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>


      <Modal.Body >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <h1>Page Under Construction</h1>
        <IoIosConstruct style={{ width: '100px', height: '100px' }} />
      </div>

      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={handleToggleFullscreen}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </Modal.Footer>

    </Modal>
  );
};

export default SettingsModal;
