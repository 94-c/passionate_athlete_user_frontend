import React, { useState } from 'react';
import { api } from '../api/Api.js';
import '../styles/ExerciseModified.css';

const ExerciseModified = () => {
  const [exerciseTypes, setExerciseTypes] = useState([
    "KETTLEBELL", "BARBELL", "DUMBBELL", "BOX", "BALL", "OTHER"
  ]);
  const [exerciseOptions, setExerciseOptions] = useState([]); // API로부터 받아온 운동 목록
  const [exercises, setExercises] = useState([]); // 추가된 운동 목록
  const [currentExercise, setCurrentExercise] = useState({
    type: '',
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

  const handleExerciseChange = async (e) => {
    const { name, value } = e.target;

    // 음수 입력을 방지
    const sanitizedValue = name === 'rounds' && value < 1 ? 1 : value;

    setCurrentExercise({ ...currentExercise, [name]: sanitizedValue });

    if (name === 'type') {
      try {
        const response = await api.get(`/exercises/type/${value}`);
        console.log('API response data:', response.data); // 콘솔에 응답 데이터 출력
        setExerciseOptions(response.data); // 운동 옵션 업데이트
      } catch (error) {
        console.error('Error fetching exercises by type:', error);
      }
    }
  };

  const handleBasicInfoChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleAddExercise = () => {
    setExercises([...exercises, currentExercise]);
    setCurrentExercise({ type: '', name: '', rounds: '', weight: '', rating: '' });
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
            <input type="number" name="rounds" placeholder="라운드 수" value={basicInfo.rounds} onChange={handleBasicInfoChange} min="1" />
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
          <select name="type" value={currentExercise.type} onChange={handleExerciseChange}>
            <option value="">운동 타입 선택</option>
            {exerciseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select name="name" value={currentExercise.name} onChange={handleExerciseChange} disabled={!currentExercise.type}>
            <option value="">운동 선택</option>
            {currentExercise.type && exerciseOptions.map(exercise => (
              <option key={exercise.id} value={exercise.name}>{exercise.name}</option>
            ))}
          </select>
          <div className="exercise-input-row">
            <input type="number" name="rounds" placeholder="라운드" value={currentExercise.rounds} onChange={handleExerciseChange} min="1" />
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
                [ {exercise.type} ] - {exercise.name} - {exercise.rounds}R / {exercise.weight}kg / {exercise.rating}
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
