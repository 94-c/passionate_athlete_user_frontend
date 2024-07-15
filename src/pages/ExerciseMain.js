import React, { useState, useEffect } from 'react';
import { api } from '../api/Api.js';
import { Tooltip } from 'react-tooltip';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/ExerciseMain.css';

const ExerciseMain = () => {
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [formData, setFormData] = useState({
    workoutDetails: [],
    rounds: '',
    rating: '',
    success: false,
    time: '',
    recordContent: '',  // Added for the text editor content
  });

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/scheduled-workouts/date?date=${today}`);
        if (response.data.length > 0) {
          const workout = response.data[0];
          const workoutDetails = workout.workoutInfos.map(info => ({
            info,
            weight: '',
          }));

          setTodayWorkout(workout);
          setFormData({
            workoutDetails,
            rounds: workout.rounds,
            rating: '',
            success: false,
            time: '',
            recordContent: '',  // Initialize the text editor content
          });
        }
      } catch (error) {
        console.error('Error fetching today\'s workout:', error);
      }
    };
    fetchTodayWorkout();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      const updatedWorkoutDetails = [...prevState.workoutDetails];
      if (name === 'weight') {
        updatedWorkoutDetails[index] = { ...updatedWorkoutDetails[index], weight: value };
      } else {
        return { ...prevState, [name]: value };
      }
      return { ...prevState, workoutDetails: updatedWorkoutDetails };
    });
  };

  const handleEditorChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      recordContent: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todayWorkout) {
      console.error('Today\'s workout is not set.');
      return;
    }

    const payload = {
      scheduledWorkoutId: todayWorkout.id,
      workoutDetails: formData.workoutDetails,
      rounds: formData.rounds,
      rating: formData.rating,
      success: formData.success,
      time: formData.time,
      recordContent: formData.recordContent,  // Include the editor content in the payload
    };

    console.log('Submitting payload:', payload);

    try {
      const response = await api.post('/workout-records', payload);
      console.log(response);
    } catch (error) {
      console.error('Error submitting workout record:', error);
      console.error('Payload:', payload);
    }
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="exercise-main-page">
      <div className="exercise-main-header">
        <h2 className="exercise-main-title">운동 기록을 추가해요 🏋️‍♂️</h2>
      </div>
      <div className="exercise-main-progress-bar">
        <span className="exercise-main-progress-step">운동 타입</span>
        <span className="exercise-main-progress-step active">기록 작성</span>
        <span className="exercise-main-progress-step">등록 완료</span>
      </div>
      <div className="exercise-main-container">
        {todayWorkout ? (
          <>
            <p className="today-info">{today} 오늘의 운동 "<strong>{todayWorkout.title}</strong>"</p>
            <div
              className="workout-title-container"
              data-tooltip-id="tooltip"
              data-tooltip-content={todayWorkout.workoutInfos.join('\n')}
            >
              <Tooltip id="tooltip" place="top" className="tooltip" />
            </div>
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="exercise-record">
                <div className="record-item">
                  <p className="record-label">라운드</p>
                  <input type="number" name="rounds" value={formData.rounds} onChange={handleChange} className="form-input" />
                </div>
                <div className="record-item">
                  <p className="record-label">등급</p>
                  <input type="text" name="rating" value={formData.rating} onChange={handleChange} className="form-input" />
                </div>
                <div className="record-item">
                  <p className="record-label">성공 여부</p>
                  <select name="success" value={formData.success} onChange={handleChange} className="form-select">
                    <option value={false}>실패</option>
                    <option value={true}>성공</option>
                  </select>
                </div>
                <div className="record-item">
                  <p className="record-label">성공 시간</p>
                  <input type="text" name="time" value={formData.time} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="record-content-container">
                <h3 className="record-content-title">기록 일지 작성</h3>
                <div className="record-content">
                  <ReactQuill
                    value={formData.recordContent}
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
              <button type="submit" className="submit-button">기록 등록</button>
            </form>
          </>
        ) : (
          <p>오늘의 운동이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseMain;
