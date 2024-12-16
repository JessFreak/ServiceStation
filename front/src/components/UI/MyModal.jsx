import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    paddingRight: '20px',
    paddingTop: '20px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    position: 'relative',
    width: 'fit-content',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

Modal.setAppElement('#root');

function MyModal({ isOpen, onClose, children }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      {children}
      <button
        className='red-button save-button'
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: 'fit-content',
          height: 'fit-content',
          margin: '0',
        }}
      >
        X
      </button>
    </Modal>
  );
}

export default MyModal;
