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

  // 무게 단위 배열
  const weightUnits = ['KG', 'LB', 'METER', 'KM', 'MILE', 'CALORIE', 'EA']; // ExerciseModified에서 사용된 단위와 동일하게 추가

  // Fetch today's workout data
  useEffect(() => {
    const fetchTodayWorkout = async () => {
      try {
        const now = new Date();
        const kstOffset = 9 * 60 * 60 * 1000; // UTC+9 correction
        const kstTime = new Date(now.getTime() + kstOffset);

        const hour = kstTime.getUTCHours(); // Get KST hour

        if (hour >= 15) {
          kstTime.setDate(kstTime.getDate());
        } else {
          kstTime.setDate(kstTime.getDate() - 1);
        }

        const today = kstTime.toISOString().split('T')[0];
        const response = await api.get(`/scheduled-workouts/date?date=${today}`);

        if (response.data.length > 0) {
          const workout = response.data[0];
          const workoutDetails = workout.workoutInfos.map(info => ({
            exerciseId: info.exercise.id,
            exerciseName: info.exercise.name,  // Add exercise name
            weight: '',
            weightUnit: 'KG',  // 기본 단위 설정
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
        console.error("Error fetching today's workout:", error);
      }
    };
    fetchTodayWorkout();
  }, []);

  // Handle form input changes
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

  // Format duration input
  const formatDuration = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 4) return formData.duration;
    if (numericValue.length <= 2) return numericValue;
    return numericValue.length === 4
      ? `${numericValue.slice(0, 2)}:${numericValue.slice(2)}`
      : `${numericValue.charAt(0)}:${numericValue.slice(1)}`;
  };

  // Handle content changes in the editor
  const handleEditorChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      recordContent: value,
    }));
  };

  // Update success status dynamically based on input
  useEffect(() => {
    if (todayWorkout) {
      const minimumRounds = calculateMinimumRounds();
      const formattedDuration = formData.duration;

      const success = determineTimeAndRoundsSuccess(minimumRounds, formattedDuration);
      setFormData(prevFormData => ({
        ...prevFormData,
        success,
      }));
    }
  }, [formData.duration, formData.workoutDetails]);

  // Calculate the minimum rounds from all exercises
  const calculateMinimumRounds = () => {
    const roundValues = formData.workoutDetails.map(detail => parseInt(detail.rounds) || 0);
    return Math.min(...roundValues);
  };

  // Calculate minimum rating
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

  // Parse time from "minutes:seconds" format to total seconds
  const parseTime = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  };

  // Determine success for TIME_AND_ROUNDS mode
  const determineTimeAndRoundsSuccess = (minimumRounds, formattedDuration) => {
    const totalSeconds = parseTime(formattedDuration);
    const targetSeconds = parseTime(todayWorkout?.time);
    const targetRounds = parseInt(todayWorkout?.round || 0, 10);

    if (minimumRounds < targetRounds || totalSeconds > targetSeconds) {
      return false; // Fail if rounds are less or time is greater than target
    }
    return true; // Success if both conditions are met
  };

  // Determine success for PASS_OR_NONPASS mode
  const determinePassOrNonPass = (formattedDuration) => {
    const totalSeconds = parseTime(formattedDuration);
    const targetSeconds = parseTime(todayWorkout?.time);
    return totalSeconds <= targetSeconds ? 'SUCCESS' : 'FAIL';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todayWorkout) {
      console.error("Today's workout is not set.");
      return;
    }

    const minimumRounds = calculateMinimumRounds();
    const formattedDuration = formData.duration;
    let success = determineTimeAndRoundsSuccess(minimumRounds, formattedDuration) ? 1 : 0;

    const payload = {
      scheduledWorkoutId: todayWorkout.id,
      workoutDetails: formData.workoutDetails,
      rounds: minimumRounds,
      rating: calculateMinimumRating(),
      success,  // 1 for success, 0 for failure
      duration: formattedDuration,
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
            <p className="today-info">
              {new Date(todayWorkout.date).toISOString().split('T')[0]} 오늘의 운동 <br />
              "<strong>{todayWorkout.title}</strong>"
            </p>
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="exercise-record">
                <h2>기본 정보</h2>
                <div className="record-item">
                  <div className="form-input readonly">{calculateMinimumRounds()}</div>
                  <div className="form-input readonly">{calculateMinimumRating()}</div>
                </div>
                <div className="record-item">
                  {todayWorkout.workoutMode === 'TIME_AND_ROUNDS' && (
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
                      <div className={`form-input readonly ${formData.success ? 'success' : 'failure'}`}>
                        {formData.success ? '성공' : '실패'}
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
                    <h3>{detail.exerciseName}</h3>
                    <div className="exercise-record-item-row">
                      <select
                        name="rating"
                        value={detail.rating}
                        onChange={(e) => handleChange(e, index)}
                        className="custom-select-input"
                      >
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
                      <input
                        type="number"
                        name="rounds"
                        value={detail.rounds}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="라운드"
                        className="custom-select-input"
                      />
                      <input
                        type="text"
                        name="weight"
                        value={detail.weight}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="무게"
                        className="custom-select-input"
                      />
                      <select
                        name="weightUnit"
                        value={detail.weightUnit}
                        onChange={(e) => handleChange(e, index)}
                        className="custom-select-input"
                      >
                        {weightUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
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
