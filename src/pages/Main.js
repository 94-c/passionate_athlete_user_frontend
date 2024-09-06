import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.css';
import logo from '../assets/logo.png'; 
import { api } from '../api/Api.js';
import { UserContext } from '../contexts/UserContext';
import TodayExerciseModal from '../components/TodayExerciseModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faWeight, faRunning, faBoxOpen } from '@fortawesome/free-solid-svg-icons';  // Added faBoxOpen for Time Capsule

const Main = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(UserContext);
  const [continuousAttendance, setContinuousAttendance] = useState(0);

  useEffect(() => {
    const fetchContinuousAttendance = async () => {
      if (user) {
        try {
          const response = await api.get('/attendances/continue');
          setContinuousAttendance(response.data.continuousAttendanceCount);
        } catch (error) {
          console.error('Error fetching continuous attendance:', error);
        }
      }
    };

    fetchContinuousAttendance();
  }, [user]);

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
    <div className="main-contanier-page">
      <div className="head-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="header-container">
        <div className="info-section">
          <p className="attendance-info">
            {user ? (
              <span>
                <span className="branch-name"> [{user.branchName}] </span>
                <span> {user.name} 님은 연속 </span>
                <span className="highlight">{continuousAttendance} 일</span>
                <span> 출석 중</span>
              </span>
            ) : (
              <span>로그인 해주세요.</span>
            )}
          </p>
        </div>
      </div>
      <div className="main-button-container">
        <button className="main-button-item large-button" onClick={() => handleNavigate('/exercise')}>
          <FontAwesomeIcon icon={faDumbbell} className="main-button-icon" />
          <span className="main-button-title">운동</span>
        </button>
        <button className="main-button-item small-button" onClick={() => handleNavigate('/timecapsule')}>
          <FontAwesomeIcon icon={faBoxOpen} className="main-button-icon" />
          <span className="main-button-title">타임캡슐</span>  
        </button>
        <button className="main-button-item small-button" onClick={handleTodayExerciseClick}>
          <FontAwesomeIcon icon={faRunning} className="main-button-icon" />
          <span className="main-button-title">오늘의 운동</span>
        </button>
        <button className="main-button-item large-button" onClick={() => handleNavigate('/inbody')}>
          <FontAwesomeIcon icon={faWeight} className="main-button-icon" />
          <span className="main-button-title">인바디</span>
        </button>
      </div>
      <TodayExerciseModal show={showModal} handleClose={handleModalClose} />
    </div>
  );
};

export default Main;
