import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ExerciseCustom.css';

const ExerciseCustom = ({ onBack }) => {
  const [formData, setFormData] = useState({
    exerciseName: '',
    repetitions: '',
    weight: '',
    duration: '',
    rating: '',
    success: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/workout-records', formData)
      .then(response => console.log(response))
      .catch(error => console.error(error));
  };

  return (
    <div className="slide-in">
      <button className="back-button" onClick={onBack}>Back</button>
      <form onSubmit={handleSubmit}>
        <label>
          운동 이름:
          <input type="text" name="exerciseName" value={formData.exerciseName} onChange={handleChange} />
        </label>
        <label>
          횟수:
          <input type="number" name="repetitions" value={formData.repetitions} onChange={handleChange} />
        </label>
        <label>
          무게:
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
        </label>
        <label>
          시간:
          <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
        </label>
        <label>
          등급:
          <input type="text" name="rating" value={formData.rating} onChange={handleChange} />
        </label>
        <label>
          성공 여부:
          <input type="checkbox" name="success" checked={formData.success} onChange={e => setFormData(prevState => ({ ...prevState, success: e.target.checked }))} />
        </label>
        <button type="submit">기록 등록</button>
      </form>
    </div>
  );
};

export default ExerciseCustom;
