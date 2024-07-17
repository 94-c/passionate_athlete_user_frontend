import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import { Tooltip } from 'react-tooltip';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/ExerciseMain.css';

const QuillWrapper = (props) => {
  const ref = useRef(null);

  useEffect(() => {
    // Any logic needed for the QuillWrapper
  }, []);

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
    recordContent: '',  // Added for the text editor content
  });
  const tooltipRef = useRef(null);

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/scheduled-workouts/date?date=${today}`);
        if (response.data.length > 0) {
          const workout = response.data[0];
          const workoutDetails = workout.workoutInfos.map(info => ({
            exercise: info.exercise.name,
            weight: '',
          }));

          setTodayWorkout(workout);
          setFormData({
            workoutDetails,
            rounds: workout.rounds,
            rating: '',
            success: false,
            duration: '',
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
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    // Limit to 4 characters
    if (numericValue.length > 4) {
      return formData.duration;
    }
    // Format as mm:ss
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
      duration: formData.duration,
      recordContent: formData.recordContent,  // Include the editor content in the payload
      exerciseType: workoutType,  // Include the workout type in the payload
    };

    console.log('Submitting payload:', payload);

    try {
      const response = await api.post('/workout-records', payload);
      console.log(response);
      alert('본운동 기록이 완료되었습니다.');
      navigate('/exercise');
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
              data-tooltip-content={todayWorkout.workoutInfos.map(info => info.exercise.name).join('\n')}
              ref={tooltipRef}
            >
              <Tooltip id="tooltip" place="top" />
            </div>
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="exercise-record">
                <div className="record-item">
                  <input type="number" name="rounds" value={formData.rounds} onChange={handleChange} className="form-input" placeholder="라운드" />
                  <select name="rating" value={formData.rating} onChange={handleChange} className="form-select">
                    <option value="">등급</option>
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
                <div className="record-item">
                  <select name="success" value={formData.success} onChange={handleChange} className="form-select">
                    <option value={false}>실패</option>
                    <option value={true}>성공</option>
                  </select>
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="form-input" placeholder="시간 (분:초)" maxLength="5" />
                </div>
              </div>
              <div className="exercise-info">
                {formData.workoutDetails.map((detail, index) => (
                  <div className="workout-detail" key={index}>
                    <h3>{detail.exercise}</h3>
                    <div className="exercise-record-itme">
                      <input type="text" name="rating" placeholder="Rating" className="form-input" />
                      <input type="number" name="rounds" placeholder="Rounds" className="form-input" />
                      <input type="text" name="weight" placeholder="Lbs" value={detail.weight} onChange={(e) => handleChange(e, index)} className="form-input" />
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
