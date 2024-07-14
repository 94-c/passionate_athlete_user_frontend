import React, { useState, useEffect } from 'react';
import { api } from '../api/Api.js';
import '../styles/ExerciseMain.css';

const ExerciseMain = ({ onBack }) => {
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [formData, setFormData] = useState({
    workoutDetails: [],
    rounds: '',
    time: '',
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
            success: false,
          }));

          setTodayWorkout(workout);
          setFormData({
            workoutDetails,
            rounds: workout.rounds,
            time: workout.time,
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
      if (name === 'success') {
        updatedWorkoutDetails[index] = { ...updatedWorkoutDetails[index], [name]: e.target.checked };
      } else {
        updatedWorkoutDetails[index] = { ...updatedWorkoutDetails[index], [name]: value };
      }
      return { ...prevState, workoutDetails: updatedWorkoutDetails };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      scheduledWorkoutId: todayWorkout.id,
      workoutDetails: formData.workoutDetails,
      rounds: formData.rounds,
      time: formData.time,
    };

    try {
      const response = await api.post('/api/workout-records', payload);
      console.log(response);
    } catch (error) {
      console.error('Error submitting workout record:', error);
    }
  };

  return (
    <div className="slide-in">
      <button className="back-button" onClick={onBack}>Back</button>
      {todayWorkout ? (
        <form onSubmit={handleSubmit}>
          <h2>{todayWorkout.title}</h2>
          <div>
            <h3>운동 세부 항목</h3>
            <label>
              라운드:
              <input type="number" name="rounds" value={formData.rounds} readOnly />
            </label>
            <label>
              시간:
              <input type="text" name="time" value={formData.time} readOnly />
            </label>
            {formData.workoutDetails.map((detail, index) => (
              <div key={index} className="workout-detail">
                <p>{detail.info}</p>
                <label>
                  무게:
                  <input type="number" name="weight" value={detail.weight} onChange={(e) => handleChange(e, index)} />
                </label>
                <label>
                  성공 여부:
                  <input type="checkbox" name="success" checked={detail.success} onChange={(e) => handleChange(e, index)} />
                </label>
              </div>
            ))}
          </div>
          <button type="submit">기록 등록</button>
        </form>
      ) : (
        <p>오늘의 운동이 없습니다.</p>
      )}
    </div>
  );
};

export default ExerciseMain;
