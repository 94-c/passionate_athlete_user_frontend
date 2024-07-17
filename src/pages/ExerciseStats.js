import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/ExerciseStats.css';

const ExerciseStats = () => {
  const [weeklySuccessRate, setWeeklySuccessRate] = useState(80); // 예시 데이터
  const [monthlySuccessRate, setMonthlySuccessRate] = useState(70); // 예시 데이터
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Fetch weekly and monthly success rate from the API
    // setWeeklySuccessRate(fetchedWeeklyRate);
    // setMonthlySuccessRate(fetchedMonthlyRate);
  }, []);

  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);
  };

  useEffect(() => {
    if (showTooltip) {
      const handleClickOutside = (event) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
          setShowTooltip(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showTooltip]);

  return (
    <div className="exercise-stats-page">
      <div className="exercise-dashboard">
        <h1 className="exercise-title">
          운동 통계
          <FontAwesomeIcon 
            icon={faQuestionCircle} 
            className="question-icon"
            onClick={handleTooltipToggle}
          />
        </h1>

        {showTooltip && (
          <div className="tooltip" ref={tooltipRef}>
            <p>총 운동 시간: 누적된 총 운동 시간입니다.</p>
            <p>총 운동 횟수: 누적된 총 운동 횟수입니다.</p>
            <p>평균 운동 강도: 평균 운동 강도입니다.</p>
            <p>최고 운동 기록: 가장 긴 시간 동안 지속된 운동 기록입니다.</p>
            <p>출석률: 주간 및 월간 운동 출석률입니다.</p>
            <p>성공률: 주간 및 월간 운동 성공률입니다.</p>
          </div>
        )}

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
                <td>300 시간</td>
                <td>150 회</td>
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
                <td>SS</td>
                <td>2 시간 30 분</td>
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
                <td>{weeklySuccessRate}%</td>
                <td>{monthlySuccessRate}%</td>
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
                <td>{weeklySuccessRate}%</td>
                <td>{monthlySuccessRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExerciseStats;
