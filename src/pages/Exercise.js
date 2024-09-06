import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Exercise.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faChartBar, faTrophy, faQuestionCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Exercise = () => {
  const navigate = useNavigate();
  const [tooltipVisible, setTooltipVisible] = useState(false); // State for tooltip visibility

  const handleNavigate = (path) => {
    navigate(path);
  };

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible); // Toggle tooltip visibility
  };

  return (
    <div className="exercise-page-custom">
      <div className="exercise-header-custom">
        <h2 className="exercise-title-custom">오늘의 운동</h2>
        <span className={`exercise-tooltip-icon-custom ${tooltipVisible ? 'active' : ''}`} onClick={toggleTooltip}>
          <FontAwesomeIcon icon={faQuestionCircle} className="exercise-question-icon-custom" />
          {tooltipVisible && (
            <span className="exercise-tooltip-text-custom">
              이 페이지에서는 다음과 같은 기능을 사용할 수 있습니다: <br />
              - 운동 기록: 운동 기록을 확인하고 추가할 수 있습니다. <br />
              - 운동 달력: 운동 일정을 달력으로 확인합니다. <br />
              - 운동 통계: 운동 통계를 확인할 수 있습니다. <br />
              - 운동 랭킹: 운동 랭킹을 확인할 수 있습니다.
            </span>
          )}
        </span>
      </div>
      <div className="exercise-container-custom">
        <button className="exercise-btn-custom" onClick={() => handleNavigate('/exercise/record')}>
          <FontAwesomeIcon icon={faDumbbell} className="exercise-button-icon-custom" />
          <span className="exercise-button-title-custom">운동 기록</span>
        </button>
        <button className="exercise-btn-custom" onClick={() => handleNavigate('/exercise/calendar')}>
          <FontAwesomeIcon icon={faCalendarAlt} className="exercise-button-icon-custom" />
          <span className="exercise-button-title-custom">운동 달력</span>
        </button>
        <button className="exercise-btn-custom" onClick={() => handleNavigate('/exercise/stats')}>
          <FontAwesomeIcon icon={faChartBar} className="exercise-button-icon-custom" />
          <span className="exercise-button-title-custom">운동 통계</span>
        </button>
        <button className="exercise-btn-custom" onClick={() => handleNavigate('/exercise/rank')}>
          <FontAwesomeIcon icon={faTrophy} className="exercise-button-icon-custom" />
          <span className="exercise-button-title-custom">운동 랭킹</span>
        </button>
      </div>
    </div>
  );
};

export default Exercise;
