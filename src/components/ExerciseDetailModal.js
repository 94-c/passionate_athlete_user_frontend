import React from 'react';
import '../styles/ExerciseDetailModal.css';

const ExerciseDetailModal = ({ isOpen, onClose, record }) => {
  if (!isOpen) return null;

  const formatRecordValue = (value) => {
    return value === null || value === '' ? '-' : value;
  };

  const formatExerciseType = (type) => {
    switch (type) {
      case 'MODIFIED':
        return '[변형] 변형 운동';
      case 'ADDITIONAL':
        return '[추가] 추가 운동';
      default:
        return '[본운동]';
    }
  };

  return (
    <div className="exercise-modal-overlay" onClick={onClose}>
      <div className="exercise-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="exercise-close-button" onClick={onClose}>X</button>
        <h3>{formatExerciseType(record.exerciseType)} {record.scheduledWorkoutTitle}</h3>
        <p>라운드: {formatRecordValue(record.rounds)}</p>
        <p>시간: {formatRecordValue(record.duration)}</p>
        <p>등급: {formatRecordValue(record.rating)}</p>
        <p>성공: <span className={record.success ? 'exercise-success' : 'exercise-failure'}>{record.success ? '성공' : '실패'}</span></p>
        <p>내용: {record.recordContent}</p>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;
