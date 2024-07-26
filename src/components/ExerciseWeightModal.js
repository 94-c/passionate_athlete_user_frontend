import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { api } from '../api/Api.js';
import '../styles/ExerciseWeightModal.css';

const exerciseTypes = ['KETTLEBELL', 'BARBELL', 'DUMBBELL', 'BOX', 'BALL', 'OTHER'];

const ExerciseWeightModal = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState(exerciseTypes[0]);
  const [exerciseWeights, setExerciseWeights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchExerciseWeights(selectedType);
    }
  }, [isOpen, selectedType]);

  const fetchExerciseWeights = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/workout-statics/last-weights`, { params: { exerciseType: type } });
      setExerciseWeights(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="weight-modal-overlay" onClick={onClose}>
      <div className="weight-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="weight-modal-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="weight-modal-title">운동별 최근 무게</h2>
        <div className="weight-modal-tabs-container">
          <div className="weight-modal-tabs">
            {exerciseTypes.map((type) => (
              <button
                key={type}
                className={`weight-modal-tab ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table className="weight-modal-table">
            <thead>
              <tr>
                <th>운동명</th>
                <th>최근 무게</th>
              </tr>
            </thead>
            <tbody>
              {exerciseWeights.length > 0 ? (
                exerciseWeights.map((exercise) => (
                  <tr key={exercise.exerciseName}>
                    <td>{exercise.exerciseName}</td>
                    <td>{exercise.weight}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">최근 운동 무게가 존재하지 않습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExerciseWeightModal;
