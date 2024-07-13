import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Exercise.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faChartBar, faTrophy, faClipboard } from '@fortawesome/free-solid-svg-icons';

const Exercise = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="exercise-page">
      <div className="exercise-container">
        <button className="exercise-btn" onClick={() => handleNavigate('/exercise/record')}>
          <FontAwesomeIcon icon={faDumbbell} className="exercise-button-icon" />
          <span className="exercise-button-title">운동 기록</span>
        </button>
        <button className="exercise-btn" onClick={() => handleNavigate('/exercise/stats')}>
          <FontAwesomeIcon icon={faChartBar} className="exercise-button-icon" />
          <span className="exercise-button-title">운동 통계</span>
        </button>
        <button className="exercise-btn" onClick={() => handleNavigate('/exercise/rank')}>
          <FontAwesomeIcon icon={faTrophy} className="exercise-button-icon" />
          <span className="exercise-button-title">운동 랭크</span>
        </button>
        <button className="exercise-btn" onClick={() => handleNavigate('/exercise/board')}>
          <FontAwesomeIcon icon={faClipboard} className="exercise-button-icon" />
          <span className="exercise-button-title">운동 게시판</span>
        </button>
      </div>
    </div>
  );
};

export default Exercise;
