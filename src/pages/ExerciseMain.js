import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/ExerciseMain.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';

const QuillWrapper = (props) => {
  const ref = useRef(null);
  return <ReactQuill ref={ref} {...props} />;
};

const ExerciseMain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const workoutType = location.state?.workoutType || 'MAIN';
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [formData, setFormData] = useState({
    workoutDetails: [],
    rounds: '',
    rating: '',
    success: true,
    duration: '',
    completionTime: '',
    recordContent: '',
  });

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      try {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 15) {
          now.setDate(now.getDate() - 1);
        }

        const today = now.toISOString().split('T')[0];
        const response = await api.get(`/scheduled-workouts/date?date=${today}`);

        if (response.data.length > 0) {
          const workout = response.data[0];
          const workoutDetails = workout.workoutInfos.map(info => ({
            exerciseId: info.exercise.id,
            exercise: info.exercise.name,
            weight: '',
            rounds: '',
            rating: '',
            exerciseType: info.exercise.type,
          }));

          setTodayWorkout(workout);
          setFormData(prevFormData => ({
            ...prevFormData,
            workoutDetails,
            rounds: workout.rounds,
          }));
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
      updatedWorkoutDetails[index] = { ...updatedWorkoutDetails[index], [name]: value };

      if (name === 'duration' || name === 'completionTime') {
        return { ...prevState, [name]: formatDuration(value) };
      }
      return { ...prevState, workoutDetails: updatedWorkoutDetails };
    });
  };

  const formatDuration = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 4) return formData.duration;
    if (numericValue.length <= 2) return numericValue;
    return numericValue.length === 4
      ? `${numericValue.slice(0, 2)}:${numericValue.slice(2)}`
      : `${numericValue.charAt(0)}:${numericValue.slice(1)}`;
  };

  const handleEditorChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      recordContent: value,
    }));
  };

  const calculateMinimum = (field) => {
    const values = formData.workoutDetails.map(detail => parseFloat(detail[field] || 0));
    return Math.min(...values);
  };

  const calculateMinimumRating = () => {
    const ratingOrder = {
      "SS+": 1, "SS": 2, "A+": 3, "A": 4,
      "B+": 5, "B": 6, "C+": 7, "C": 8,
      "D+": 9, "D": 10
    };

    const ratings = formData.workoutDetails.map(detail => detail.rating).filter(Boolean);

    if (ratings.length === 0) return '';
    return ratings.reduce((minRating, currentRating) =>
      ratingOrder[currentRating] > ratingOrder[minRating] ? currentRating : minRating
    );
  };

  const parseTime = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  };

  const determineSuccess = (minimumRounds, formattedDuration) => {
    const totalSeconds = parseTime(formattedDuration);
    const targetSeconds = parseTime(todayWorkout?.time);
    return minimumRounds >= todayWorkout?.rounds && totalSeconds <= targetSeconds;
  };

  const determinePassOrNonPass = (formattedDuration) => {
    const totalSeconds = parseTime(formattedDuration);
    const targetSeconds = parseTime(todayWorkout?.time);
    return totalSeconds <= targetSeconds ? 'SUCCESS' : 'FAIL';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todayWorkout) {
      console.error('Today\'s workout is not set.');
      return;
    }

    const minimumRounds = calculateMinimum('rounds');
    const formattedDuration = formData.duration;
    let success = 1;  // 기본적으로 성공(1)으로 설정
    let status = '';

    if (todayWorkout.workoutMode === 'PASS_OR_NONPASS') {
      status = determinePassOrNonPass(formData.completionTime);
      success = status === 'SUCCESS' ? 1 : 0;  // 'SUCCESS'면 1, 아니면 0
    } else {
      success = determineSuccess(minimumRounds, formattedDuration) ? 1 : 0;  // 성공이면 1, 실패면 0
    }

    const payload = {
      scheduledWorkoutId: todayWorkout.id,
      workoutDetails: formData.workoutDetails,
      rounds: minimumRounds,
      rating: calculateMinimumRating(),
      success,  // 숫자 1 또는 0으로 전송
      duration: todayWorkout.workoutMode === 'PASS_OR_NONPASS' ? formData.completionTime : formattedDuration,
      recordContent: formData.recordContent,
      exerciseType: workoutType,
    };

    try {
      await api.post('/workout-records', payload);
      alert('본운동 기록이 완료되었습니다.');
      navigate('/exercise');
    } catch (error) {
      console.error('Error submitting workout record:', error);
    }
  };

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
            <p className="today-info">{new Date(todayWorkout.date).toISOString().split('T')[0]} 오늘의 운동 "<strong>{todayWorkout.title}</strong>"</p>
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="exercise-record">
                <h2>기본 정보</h2>
                <div className="record-item">
                  <div className="form-input readonly">{calculateMinimum('rounds')}</div>
                  <div className="form-input readonly">{calculateMinimumRating()}</div>
                </div>
                <div className="record-item">
                  {todayWorkout.workoutMode !== 'ROUND_RANKING' && todayWorkout.workoutMode !== 'PASS_OR_NONPASS' && (
                    <>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="시간 (분:초)"
                        maxLength="5"
                      />
                      <div className={`form-input readonly ${determineSuccess(calculateMinimum('rounds'), formData.duration) ? 'success' : 'failure'}`}>
                        {determineSuccess(calculateMinimum('rounds'), formData.duration) ? '성공' : '실패'}
                      </div>
                    </>
                  )}
                  {todayWorkout.workoutMode === 'ROUND_RANKING' && (
                    <div className="form-input readonly success">
                      합격
                    </div>
                  )}
                  {todayWorkout.workoutMode === 'PASS_OR_NONPASS' && (
                    <>
                      <input
                        type="text"
                        name="completionTime"
                        value={formData.completionTime}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="완료 시간 (분:초)"
                        maxLength="5"
                      />
                      <div className={`form-input readonly ${determinePassOrNonPass(formData.completionTime).toLowerCase()}`}>
                        {determinePassOrNonPass(formData.completionTime) === 'SUCCESS' ? (
                          <span className="success">SUCCESS</span>
                        ) : (
                          <span className="failure">FAIL</span>
                        )}
                      </div>
                    </>
                  )}

                </div>
              </div>
              <div className="exercise-info">
                <h2>운동 정보</h2>
                {formData.workoutDetails.map((detail, index) => (
                  <div className="workout-detail" key={index}>
                    <h3>{detail.exercise}</h3>
                    <div className="exercise-record-item-row">
                      <input
                        type="text"
                        name="rating"
                        value={detail.rating}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="등급"
                        className="form-input"
                      />
                      <input
                        type="number"
                        name="rounds"
                        value={detail.rounds}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="라운드"
                        className="form-input"
                      />
                      <input
                        type="text"
                        name="weight"
                        value={detail.weight}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="무게"
                        className="form-input"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="record-content-container">
                <div className="custom-quill-container">
                  <QuillWrapper
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
                  />
                </div>
              </div>
              <button type="submit" className="submit-button">등록</button>
            </form>
          </>
        ) : (
          <div className="no-workout">
            <FontAwesomeIcon icon={faDumbbell} />
            <p>오늘의 운동이 존재하지 않습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseMain;
