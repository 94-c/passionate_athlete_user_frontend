import React from 'react';
import '../styles/TodayExerciseModalWrapper.css';

const TodayExerciseModalWrapper = ({ show, handleClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="today-modal">
            <div className="today-modal-content">
                <span className="today-close-button" onClick={handleClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default TodayExerciseModalWrapper;
