import React, { useEffect, useState, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { api } from '../api/Api.js';
import '../styles/ExerciseStats.css';
import { UserContext } from '../contexts/UserContext.js';
import ExerciseWeightModal from '../components/ExerciseWeightModal';

const ExerciseStats = () => {
  const { user: currentUser } = useContext(UserContext); 
  const [stats, setStats] = useState({
    totalDuration: 0,
    totalCount: 0,
    averageIntensity: '',
    maxRecord: '',
    weeklySuccessRate: 0,
    monthlySuccessRate: 0,
    weeklyAttendanceRate: 0,
    monthlyAttendanceRate: 0
  });
  const [exerciseWeights, setExerciseWeights] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchStats();
      fetchExerciseWeights();
    }
  }, [currentUser]);

  const fetchStats = async () => {
    try {
      const response = await api.get(`/workout-statics`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchExerciseWeights = async () => {
    try {
      const response = await api.get(`/workout-statics/exercise-weights`);
      setExerciseWeights(response.data);
    } catch (error) {
      console.error('Failed to fetch exercise weights:', error);
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="exercise-stats-page">
      <div className="exercise-dashboard">
        <div className="exercise-title-container">
          <h1 className="exercise-title">운동 통계</h1>
          <FontAwesomeIcon 
            icon={faDumbbell} 
            className="kettlebell-icon"
            onClick={handleModalToggle}
          />
        </div>

        <ExerciseWeightModal 
          isOpen={isModalOpen} 
          onClose={handleModalToggle} 
          exerciseWeights={exerciseWeights} 
        />

        <div className="exercise-summary-card">
          <h2 className="exercise-card-title">운동 요약</h2>
          <table className="exercise-summary-table">
            <thead>
              <tr>
                <th>총 운동 시간</th>
                <th>총 운동 횟수</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{(stats.totalDuration / 3600).toFixed(2)} 시간</td>
                <td>{stats.totalCount} 회</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>평균 운동 강도</th>
                <th>최고 운동 기록</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stats.averageIntensity}</td>
                <td>{stats.maxRecord}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="exercise-attendance-card">
          <h2 className="exercise-card-title">출석률</h2>
          <table className="exercise-summary-table">
            <thead>
              <tr>
                <th>주간 운동 출석률</th>
                <th>월간 운동 출석률</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stats.weeklyAttendanceRate.toFixed(2)}%</td>
                <td>{stats.monthlyAttendanceRate.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="exercise-success-rate-card">
          <h2 className="exercise-card-title">성공률</h2>
          <table className="exercise-summary-table">
            <thead>
              <tr>
                <th>주간 운동 성공률</th>
                <th>월간 운동 성공률</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stats.weeklySuccessRate.toFixed(2)}%</td>
                <td>{stats.monthlySuccessRate.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExerciseStats;
