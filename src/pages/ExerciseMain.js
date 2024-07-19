import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/ExerciseMain.css';

const QuillWrapper = (props) => {
  const ref = useRef(null);
  return <ReactQuill ref={ref} {...props} />;
};

const ExerciseMain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const workoutType = location.state?.workoutType;
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [formData, setFormData] = useState({
    workoutDetails: [],
    rounds: '',
    rating: '',
    success: false,
    duration: '',
    recordContent: '',
  });

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/scheduled-workouts/date?date=${today}`);
        if (response.data.length > 0) {
          const workout = response.data[0];
          const workoutDetails = workout.workoutInfos.map(info => ({
            exerciseId: info.exercise.id,
            exercise: info.exercise.name,
            weight: '',
            rounds: '',
            rating: '',
          }));

          setTodayWorkout(workout);
          setFormData({
            workoutDetails,
            rounds: workout.rounds,
            rating: '',
            success: false,
            duration: '',
            recordContent: '',
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
      if (['weight', 'rounds', 'rating'].includes(name)) {
        updatedWorkoutDetails[index] = { ...updatedWorkoutDetails[index], [name]: value };
      } else if (name === 'duration') {
        const formattedValue = formatDuration(value);
        return { ...prevState, duration: formattedValue };
      } else {
        return { ...prevState, [name]: value };
      }
      return { ...prevState, workoutDetails: updatedWorkoutDetails };
    });
  };

  const formatDuration = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 4) {
      return formData.duration;
    }
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length === 2) {
      return numericValue.charAt(0) + ':' + numericValue.slice(1);
    } else if (numericValue.length === 4) {
      return numericValue.slice(0, 2) + ':' + numericValue.slice(2);
    }
    return numericValue;
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

    const ratings = formData.workoutDetails.map(detail => detail.rating).filter(rating => rating);
    console.log("Ratings:", ratings); // Debugging line

    if (ratings.length === 0) {
      return '';
    }

    let minRating = ratings[0];
    for (const rating of ratings) {
      console.log(`Comparing ${rating} (${ratingOrder[rating]}) with ${minRating} (${ratingOrder[minRating]})`); // Debugging line
      if (ratingOrder[rating] > ratingOrder[minRating]) {
        minRating = rating;
      }
    }

    console.log("Minimum rating calculated:", minRating); // Debugging line
    return minRating;
  };

  const parseTime = (timeString) => {
    if (!timeString) return 0;
    const match = timeString.match(/(\d+):(\d+)/);
    if (!match) return 0;
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    return (minutes * 60) + seconds;
  };

  const determineSuccess = (minimumRounds, formattedDuration) => {
    const totalSeconds = parseTime(formattedDuration);
    const targetSeconds = parseTime(todayWorkout.time);

    return minimumRounds >= todayWorkout.rounds && totalSeconds <= targetSeconds;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todayWorkout) {
      console.error('Today\'s workout is not set.');
      return;
    }

    const minimumRounds = calculateMinimum('rounds');
    const formattedDuration = formData.duration;
    const success = determineSuccess(minimumRounds, formattedDuration);

    const payload = {
      scheduledWorkoutId: todayWorkout.id,
      workoutDetails: formData.workoutDetails,
      rounds: minimumRounds,
      rating: calculateMinimumRating(),
      success: success,
      duration: formattedDuration,
      recordContent: formData.recordContent,
      exerciseType: workoutType,
    };

    console.log('Submitting payload:', payload);

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
            <p className="today-info">{todayWorkout.date} 오늘의 운동 "<strong>{todayWorkout.title}</strong>"</p>
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="exercise-record">
                <div className="record-item">
                  <div className="form-input readonly">{calculateMinimum('rounds')}</div>
                  <div className="form-input readonly">{calculateMinimumRating()}</div>
                </div>
                <div className="record-item">
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="form-input" placeholder="시간 (분:초)" maxLength="5" />
                  <div className={`form-input readonly ${determineSuccess(calculateMinimum('rounds'), formData.duration) ? 'success' : 'failure'}`}>
                    {determineSuccess(calculateMinimum('rounds'), formData.duration) ? '성공' : '실패'}
                  </div>
                </div>
              </div>
              <div className="exercise-info">
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
                <div className="record-content">
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
