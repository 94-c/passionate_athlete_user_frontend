import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/ExerciseRecord.css';

const ExerciseRecord = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="exercise-record-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fa fa-arrow-left"></i>
        </button>
        <h2 className="title">운동 기록을 추가해요 🏋️‍♂️</h2>
      </div>
      <div className="exercise-type-container">
        <button className="exercise-type-btn" onClick={() => handleNavigate('/exercise/main')}>
          본운동
        </button>
        <button className="exercise-type-btn" onClick={() => handleNavigate('/exercise/modified')}>
          변형
        </button>
        <button className="exercise-type-btn" onClick={() => handleNavigate('/exercise/additional')}>
          추가 운동
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ExerciseRecord;
