import React from 'react';
import '../styles/Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faChartBar, faWeight, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const Main = () => {
  return (
    <div className="main-page">
      <div className="button-container">
        <button className="button-item">
          <FontAwesomeIcon icon={faClipboardList} className="button-icon" />
          <span className="button-title">운동 기록</span>
        </button>
        <button className="button-item">
          <FontAwesomeIcon icon={faChartBar} className="button-icon" />
          <span className="button-title">통계</span>
        </button>
        <button className="button-item">
          <FontAwesomeIcon icon={faDumbbell} className="button-icon" />
          <span className="button-title">오늘의 운동</span>
        </button>
        <button className="button-item">
          <FontAwesomeIcon icon={faWeight} className="button-icon" />
          <span className="button-title">인바디</span>
        </button>
      </div>
    </div>
  );
};

export default Main;
