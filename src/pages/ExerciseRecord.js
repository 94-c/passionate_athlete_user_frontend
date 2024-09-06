import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ExerciseRecord.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faSyncAlt, faPlusCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const ExerciseRecord = () => {
  const navigate = useNavigate();
  const [tooltipVisible, setTooltipVisible] = useState(false); // State for tooltip visibility

  const handleNavigate = (path, type) => {
    navigate(path, { state: { exerciseType: type } });
  };

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible); // Toggle tooltip visibility
  };

  return (
    <div className="exercise-record-page">
      <div className="exercise-record-header">
        <h1 className="exercise-record-title">
          운동 기록을 추가해요 🏋️‍♂️
        </h1>
        <span className={`exercise-tooltip-icon ${tooltipVisible ? 'active' : ''}`} onClick={toggleTooltip}>
          <FontAwesomeIcon icon={faQuestionCircle} className="exercise-question-icon" />
          {tooltipVisible && (
            <span className="exercise-tooltip-text">
              각 버튼을 클릭하여 본운동, 변형 운동, 또는 추가 운동 기록을 추가할 수 있습니다.
            </span>
          )}
        </span>
      </div>
      <div className="exercise-record-progress-bar">
        <span className="exercise-record-progress-step active">운동 타입 </span>
        <span className="exercise-record-progress-step">기록 작성 </span>
        <span className="exercise-record-progress-step">등록 완료 </span>
      </div>
      <div className="exercise-type-container">
        <button className="exercise-type-btn" onClick={() => handleNavigate('/exercise/main', 'MAIN')}>
          <FontAwesomeIcon icon={faDumbbell} className="exercise-button-icon" />
          본운동
        </button>
        <button className="exercise-type-btn" onClick={() => handleNavigate('/exercise/modified', 'MODIFIED')}>
          <FontAwesomeIcon icon={faSyncAlt} className="exercise-button-icon" />
          변형
        </button>
        <button className="exercise-type-btn" onClick={() => handleNavigate('/exercise/additional', 'ADDITIONAL')}>
          <FontAwesomeIcon icon={faPlusCircle} className="exercise-button-icon" />
          추가 운동
        </button>
      </div>
    </div>
  );
};

export default ExerciseRecord;
