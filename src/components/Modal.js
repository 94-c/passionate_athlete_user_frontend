// components/Modal.js
import React from 'react';
import '../styles/Modal.css';

const Modal = ({ show, handleClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={handleClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default Modal;
