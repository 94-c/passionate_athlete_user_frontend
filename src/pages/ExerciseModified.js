import React, { useState } from 'react';
import '../styles/ExerciseModified.css';

const ExerciseModified = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    rounds: '',
    weight: '',
    rating: ''
  });
  const [basicInfo, setBasicInfo] = useState({
    rounds: '',
    time: '',
    rating: '',
    success: ''
  });

  const handleExerciseChange = (e) => {
    setCurrentExercise({ ...currentExercise, [e.target.name]: e.target.value });
  };

  const handleBasicInfoChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleAddExercise = () => {
    setExercises([...exercises, currentExercise]);
    setCurrentExercise({ name: '', rounds: '', weight: '', rating: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
  };

  return (
    <div className="exercise-modified-page">
      <div className="exercise-modified-header">
        <h1 className="exercise-modified-title">운동 기록을 추가해요 🏋️‍♂️</h1>
      </div>
      <div className="exercise-main-progress-bar">
        <span className="exercise-main-progress-step">운동 타입</span>
        <span className="exercise-main-progress-step active">기록 작성</span>
        <span className="exercise-main-progress-step">등록 완료</span>
      </div>
      <form onSubmit={handleSubmit} className="exercise-modified-form">
        <div className="basic-info-section exercise-modified-info">
          <h2>기본 정보</h2>
          <div className="basic-info-grid">
            <input type="number" name="rounds" placeholder="라운드 수" value={basicInfo.rounds} onChange={handleBasicInfoChange} />
            <input type="text" name="time" placeholder="시간" value={basicInfo.time} onChange={handleBasicInfoChange} />
            <select name="rating" value={basicInfo.rating} onChange={handleBasicInfoChange}>
              <option value="">등급 선택</option>
              <option value="SS+">SS+</option>
              <option value="SS">SS</option>
              <option value="S+">S+</option>
              <option value="S">S</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
            </select>
            <select name="success" value={basicInfo.success} onChange={handleBasicInfoChange}>
              <option value="">결과 선택</option>
              <option value="success">성공</option>
              <option value="failure">실패</option>
            </select>
          </div>
        </div>

        <div className="exercise-info-section exercise-modified-info">
          <h2>운동 정보</h2>
          <select name="name" value={currentExercise.name} onChange={handleExerciseChange}>
            <option value="">운동 선택</option>
            <option value="운동1">운동1</option>
            <option value="운동2">운동2</option>
            <option value="운동3">운동3</option>
          </select>
          <div className="exercise-input-row">
            <input type="number" name="rounds" placeholder="라운드" value={currentExercise.rounds} onChange={handleExerciseChange} />
            <input type="text" name="weight" placeholder="무게" value={currentExercise.weight} onChange={handleExerciseChange} />
            <select name="rating" value={currentExercise.rating} onChange={handleExerciseChange}>
              <option value="">등급 선택</option>
              <option value="SS+">SS+</option>
              <option value="SS">SS</option>
              <option value="S+">S+</option>
              <option value="S">S</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
            </select>
          </div>
          <button type="button" onClick={handleAddExercise}>운동 추가</button>
        </div>

        <div className="exercise-list-section exercise-modified-info">
          <h2>추가된 운동</h2>
          <ul>
            {exercises.map((exercise, index) => (
              <li key={index}>
                {exercise.name} - {exercise.rounds}라운드 - {exercise.weight}kg - {exercise.rating}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="exercise-modified-submit-button">저장 및 제출</button>
      </form>
    </div>
  );
};

export default ExerciseModified;