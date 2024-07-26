import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/ExerciseWeightModal.css';

const ExerciseWeightModal = ({ isOpen, onClose, exerciseWeights }) => {
  if (!isOpen) return null;

  return (
    <div className="weight-modal-overlay" onClick={onClose}>
      <div className="weight-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="weight-modal-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>Exercise Type Average Weights</h2>
        <table className="weight-modal-table">
          <thead>
            <tr>
              <th>Exercise Type</th>
              <th>Average Weight</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(exerciseWeights).map((type) => (
              <tr key={type}>
                <td>{type}</td>
                <td>{exerciseWeights[type]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExerciseWeightModal;
