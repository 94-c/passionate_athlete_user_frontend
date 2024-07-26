import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.css';
import Head from '../components/Head';
import Header from '../components/Header';
import TodayExerciseModal from '../components/TodayExerciseModal'; // TodayExerciseModal 컴포넌트 import 추가
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faChartBar, faWeight, faRunning } from '@fortawesome/free-solid-svg-icons';

const Main = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleTodayExerciseClick = () => {
    setShowModal(true);
  };

  return (
    <div className="main-content">
      <Head />
      <Header />
      <div className="button-container">
        <button className="button-item" onClick={() => handleNavigate('/exercise')}>
          <FontAwesomeIcon icon={faDumbbell} className="main-button-icon" />
          <span className="main-button-title">운동</span>
        </button>
        <button className="button-item" onClick={() => handleNavigate('/stats')}>
          <FontAwesomeIcon icon={faChartBar} className="main-button-icon" />
          <span className="main-button-title">통계</span>
        </button>
        <button className="button-item" onClick={handleTodayExerciseClick}>
          <FontAwesomeIcon icon={faRunning} className="main-button-icon" />
          <span className="main-button-title">오늘의 운동</span>
        </button>
        <button className="button-item" onClick={() => handleNavigate('/inbody')}>
          <FontAwesomeIcon icon={faWeight} className="main-button-icon" />
          <span className="main-button-title">인바디</span>
        </button>
      </div>
      <TodayExerciseModal show={showModal} handleClose={handleModalClose} />
    </div>
  );
};

export default Main;
