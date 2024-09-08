import React, { useState, useEffect, useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Attendance.css';
import { api } from '../api/Api.js';
import { UserContext } from '../contexts/UserContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const Attendance = () => {
  const [date, setDate] = useState(new Date());
  const [presentDays, setPresentDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceInfo, setAttendanceInfo] = useState(null);
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [monthlyAttendanceCount, setMonthlyAttendanceCount] = useState(0);
  const [totalDaysInMonth, setTotalDaysInMonth] = useState(0);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAttendance = async () => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      try {
        const response = await api.get(`/attendances/monthly?month=${year}-${month}`);
        const data = response.data;
        setPresentDays(data.presentDays.map(day => {
          const [year, month, date] = day.split('-');
          return new Date(Date.UTC(year, month - 1, date));
        }));
        setMonthlyAttendanceCount(data.presentDays.length);
        setTotalDaysInMonth(new Date(year, month, 0).getDate());
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      }
    };

    fetchAttendance();
  }, [date]);

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  const isSameDay = (date1, date2) => {
    const utcDate2 = new Date(Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()));
    return date1.getUTCDate() === utcDate2.getUTCDate() &&
      date1.getUTCMonth() === utcDate2.getUTCMonth() &&
      date1.getUTCFullYear() === utcDate2.getUTCFullYear();
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && presentDays.some(d => isSameDay(d, date))) {
      return 'present-day';
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && presentDays.some(d => isSameDay(d, date))) {
      return <div className="highlight-dot"></div>;
    }
    return null;
  };

  const handleDateClick = async (value) => {
    const selectedDate = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
    setSelectedDate(selectedDate);
    setLoading(true);
    setError(null);
    setAttendanceInfo(null);
    setWorkoutDetails([]);

    try {
      const attendanceResponse = await api.get(`/attendances/daily?daily=${selectedDate.toISOString().split('T')[0]}`);
      setAttendanceInfo(attendanceResponse.data);

      const workoutResponse = await api.get(`/workout-records/daily?date=${selectedDate.toISOString().split('T')[0]}`);
      if (workoutResponse.data && Array.isArray(workoutResponse.data.records)) {
        setWorkoutDetails(workoutResponse.data.records);
      } else {
        setWorkoutDetails([]);
      }
    } catch (error) {
      setAttendanceInfo(null);
      setWorkoutDetails([]);
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError("출석을 하지 않으셨습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setAttendanceInfo(null);
    setWorkoutDetails([]);
    setError(null);
  };

  const formatExerciseType = (type) => {
    switch (type) {
      case 'MODIFIED':
        return '[변형] 변형 운동';
      case 'ADDITIONAL':
        return '[추가] 추가 운동';
      case 'MAIN':
        return '[본운동]';
      default:
        return '[운동]';
    }
  };

  // 인증 비율 계산
  const attendanceRate = Math.round((monthlyAttendanceCount / totalDaysInMonth) * 100);

  // 도넛 차트 데이터 설정
  const chartData = {
    labels: ['인증한 날', '인증하지 않은 날'],
    datasets: [
      {
        data: [monthlyAttendanceCount, totalDaysInMonth - monthlyAttendanceCount],
        backgroundColor: ['#ff6600', '#e0e0e0'],
        hoverBackgroundColor: ['#ff6600', '#e0e0e0'],
        borderWidth: 1,
      },
    ],
  };

  // 도넛 차트 옵션 설정
  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <div className="calendar-container">
          <Calendar
            onChange={onDateChange}
            value={date}
            calendarType="gregory"
            formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
            locale="ko-KR"
            tileClassName={tileClassName}
            tileContent={tileContent}
            onClickDay={handleDateClick}
          />
        </div>
        {/* 이번 달 총 인증 횟수와 그래프 표시 */}
        <div className="monthly-attendance-count">
          <div className="chart-container">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="chart-percentage">
              <p>{attendanceRate}%</p>
            </div>
          </div>
          <div className="chart-text">
            <p>{user?.name || "회원"}님,</p>
            <p>{date.getMonth() + 1}월달엔 총 {monthlyAttendanceCount}회 </p> 
            <p> 인증하셨네요</p>
          </div>
        </div>
      </div>
      {selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>출석</h2>
            <br />
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : attendanceInfo ? (
              <>
                <p>{attendanceInfo.username} 님의 {selectedDate.toISOString().split('T')[0]}일날 출석하셨습니다.</p>
                <div className="workout-details">
                  <h4>{selectedDate.toISOString().split('T')[0]}의 운동정보</h4>
                  <br />
                  {workoutDetails.length > 0 ? (
                    workoutDetails.map((record, index) => (
                      <div key={index} className="exercise-record">
                        <p className="record-title">{formatExerciseType(record.exerciseType)} {record.scheduledWorkoutTitle}</p>
                      </div>
                    ))
                  ) : (
                    <p>운동 기록이 없습니다.</p>
                  )}
                </div>
              </>
            ) : (
              <p>출석 정보를 가져올 수 없습니다.</p>
            )}
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
