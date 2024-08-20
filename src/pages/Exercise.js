import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Exercise.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faChartBar, faTrophy, faClipboard, faQuestionCircle, faCalendarAlt} from '@fortawesome/free-solid-svg-icons';

const Exercise = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <h2 className="exercise-title" onClick={() => handleNavigate('/main')}>오늘의 운동</h2>
        <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" />
      </div>
      <div className="exercise-container">
        <button className="exercise-btn" onClick={() => handleNavigate('/exercise/record')}>
          <FontAwesomeIcon icon={faDumbbell} className="exercise-button-icon" />
          <span className="exercise-button-title">운동 기록</span>
        </button>
        <button className="exercise-btn" onClick={() => handleNavigate('/exercise/calendar')}>
          <FontAwesomeIcon icon={faCalendarAlt} className="exercise-button-icon" />
          <span className="exercise-button-title">운동 달력</span>
        </button>
        <button className="exercise-btn" onClick={() => handleNavigate('/exercise/stats')}>
          <FontAwesomeIcon icon={faChartBar} className="exercise-button-icon" />
          <span className="exercise-button-title">운동 통계</span>
        </button>
        <button className="exercise-btn" onClick={() => handleNavigate('/exercise/rank')}>
          <FontAwesomeIcon icon={faTrophy} className="exercise-button-icon" />
          <span className="exercise-button-title">운동 랭킹</span>
        </button>
        {/* <button className="exercise-btn" onClick={() => handleNavigate('/exercise/board')}>
          <FontAwesomeIcon icon={faClipboard} className="exercise-button-icon" />
          <span className="exercise-button-title">운동 게시판</span>
        </button> */}
      </div>
    </div>
  );
};

export default Exercise;
