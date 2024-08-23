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
        <h3 className="exercise-modal-title">{formatExerciseType(record.exerciseType)} {record.scheduledWorkoutTitle}</h3>
        
        {/* 운동 세부 정보 */}
        <div className="exercise-modal-summary">
          <div className="summary-item">
            <span className="summary-label">라운드:</span>
            <span className="summary-value">{formatRecordValue(record.rounds)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">시간:</span>
            <span className="summary-value">{formatRecordValue(record.duration)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">등급:</span>
            <span className="summary-value">{formatRecordValue(record.rating)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">성공여부:</span>
            <span className={`summary-value ${record.success ? 'exercise-success' : 'exercise-failure'}`}>
              {record.success ? '성공' : '실패'}
            </span>
          </div>
        </div>

        {/* 운동 히스토리 */}
        <div className="exercise-modal-history">
          {record.histories.length > 0 ? (
            record.histories.map((history, index) => (
              <div key={index} className="exercise-modal-history-item">
                <h4 className="exercise-name">{history.exerciseName}</h4>
                <div className="exercise-details">
                  <span>{formatRecordValue(history.rating)}</span>
                  <span>{formatRecordValue(history.weight)} kg</span>
                  <span>{formatRecordValue(history.repetitions)} 라운드</span>
                </div>
              </div>
            ))
          ) : (
            <div className="exercise-modal-history-item">
              <h4 className="exercise-name">운동 기록 없음</h4>
              <div className="exercise-details">
                <span>-</span>
                <span>-</span>
                <span>-</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;
