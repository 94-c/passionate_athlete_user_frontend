import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/ExerciseCustom.css';
import ReactQuill from 'react-quill';
import Modal from 'react-modal';
import ExerciseTermsModal from '../components/ExerciseTermsModal';

const QuillWrapper = (props) => {
  const ref = useRef(null);
  return <ReactQuill ref={ref} {...props} />;
};

const ExerciseCustom = () => {
  const navigate = useNavigate();
  const [exerciseOptions, setExerciseOptions] = useState([]); // API로부터 받아온 운동 목록
  const [exercises, setExercises] = useState([]); // 추가된 운동 목록
  const [currentExercise, setCurrentExercise] = useState({
    type: '',
    name: '',
    rounds: '',
    weight: '',
    rating: ''
  });
  const [recordContent, setRecordContent] = useState(''); // 기록 내용 상태 추가

  // 모달 상태 추가
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const exerciseTypes = [
    "KETTLEBELL", "BARBELL", "DUMBBELL", "BOX", "BALL", "OTHER"
  ];

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

  const handleAddExercise = () => {
    if (!currentExercise.rounds || !currentExercise.weight || !currentExercise.rating) {
      alert('라운드, 무게, 등급을 모두 입력하세요.');
      return;
    }
    setExercises([...exercises, currentExercise]);
    setCurrentExercise({ type: '', name: '', rounds: '', weight: '', rating: '' });
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workoutDetails = exercises.map(exercise => ({
      exerciseName: exercise.name,
      weight: exercise.weight,
      rounds: exercise.rounds,
      rating: exercise.rating,
    }));

    const payload = {
      workoutDetails: workoutDetails,
      recordContent: recordContent, // 기록 내용을 추가합니다.
      exerciseType: 'ADDITIONAL'
    };

    try {
      await api.post('/workout-records', payload);
      alert('운동 기록이 저장되었습니다.');
      navigate('/exercise');
    } catch (error) {
      console.error('Error saving workout record:', error);
    }
  };

  const handleEditorChange = (content) => {
    setRecordContent(content);
  };

  useEffect(() => {
    if (currentExercise.type) {
      const fetchExerciseOptions = async () => {
        try {
          const response = await api.get(`/exercises/type/${currentExercise.type}`);
          setExerciseOptions(response.data);
        } catch (error) {
          console.error('Error fetching exercise options:', error);
        }
      };
      fetchExerciseOptions();
    }
  }, [currentExercise.type]);

  return (
    <div className="exercise-custom-page">
      <div className="exercise-custom-header">
        <h1 className="exercise-custom-title">운동 기록을 추가해요 🏋️‍♂️</h1>
      </div>
      <div className="exercise-main-progress-bar">
        <span className="exercise-main-progress-step">운동 타입</span>
        <span className="exercise-main-progress-step active">기록 작성</span>
        <span className="exercise-main-progress-step">등록 완료</span>
      </div>
      <form onSubmit={handleSubmit} className="exercise-custom-form">
        <div className="exercise-info-section exercise-custom-info">
          <div className="exercise-info-header">
            <h2>운동 정보</h2>
            <span className="register-new-exercise" onClick={() => setModalIsOpen(true)}>새로운 운동을 등록하시겠습니까?</span>
          </div>
          <select name="type" value={currentExercise.type} onChange={handleExerciseChange} className="custom-input">
            <option value="">운동 타입 선택</option>
            {exerciseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select name="name" value={currentExercise.name} onChange={handleExerciseChange} disabled={!currentExercise.type} className="custom-input">
            <option value="">운동 선택</option>
            {currentExercise.type && exerciseOptions.map(exercise => (
              <option key={exercise.id} value={exercise.name}>{exercise.name}</option>
            ))}
          </select>
          <div className="exercise-input-row">
            <input type="number" name="rounds" placeholder="라운드" value={currentExercise.rounds} onChange={handleExerciseChange} min="1" className="custom-input" />
            <input type="text" name="weight" placeholder="무게" value={currentExercise.weight} onChange={handleExerciseChange} className="custom-input" />
            <select name="rating" value={currentExercise.rating} onChange={handleExerciseChange} className="custom-input">
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
              <option value="N">등급없음</option>
            </select>
            <button type="button" onClick={handleAddExercise} className="add-exercise-button">추가</button>
          </div>
        </div>

        <div className="exercise-list-section exercise-custom-info">
          <h2>추가된 운동</h2>
          <ul>
            {exercises.map((exercise, index) => (
              <li key={index} className="exercise-index-item">
                [ {exercise.type} ] - {exercise.name} - {exercise.rounds}R / {exercise.weight}kg / {exercise.rating}
                <button type="button" className="remove-exercise-button" onClick={() => handleRemoveExercise(index)}>X</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="record-content-container">
          <div className="record-content">
            <QuillWrapper
              value={recordContent}
              onChange={handleEditorChange}
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'align': [] }],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
              formats={[
                'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'align', 'link', 'image'
              ]}
              placeholder="기록 내용을 입력하세요."
              className="text-editor"
            />
          </div>
        </div>

        <button type="submit" className="exercise-custom-submit-button">저장</button>
      </form>

      <ExerciseTermsModal
        show={modalIsOpen}
        handleClose={() => setModalIsOpen(false)}
      />
    </div>
  );
};

export default ExerciseCustom;
