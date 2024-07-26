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

  const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className="exercise-modal-overlay" onClick={onClose}>
      <div className="exercise-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="exercise-close-button" onClick={onClose}>X</button>
        <h3 className="exercise-modal-title">{formatExerciseType(record.exerciseType)} {record.scheduledWorkoutTitle}</h3>
        <table className="exercise-modal-table">
          <tbody>
            <tr>
              <th>라운드</th>
              <td>{formatRecordValue(record.rounds)}</td>
              <th>시간</th>
              <td>{formatRecordValue(record.duration)}</td>
            </tr>
            <tr>
              <th>등급</th>
              <td>{formatRecordValue(record.rating)}</td>
              <th>성공여부</th>
              <td className={record.success ? 'exercise-success' : 'exercise-failure'}>
                {record.success ? '성공' : '실패'}
              </td>
            </tr>
            <tr>
              <th colSpan="4">내용</th>
            </tr>
            <tr>
              <td colSpan="4">{stripHtmlTags(record.recordContent)}</td>
            </tr>
            <tr>
              <th colSpan="4">히스토리</th>
            </tr>
            <tr>
              <td colSpan="4">
                {record.histories.map((history, index) => (
                  <div key={index} className="exercise-modal-history-item">
                    <span>운동: {history.exerciseName}</span>
                    <span>무게: {history.weight} 라운드: {history.repetitions} 등급: {history.rating}</span>
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;
