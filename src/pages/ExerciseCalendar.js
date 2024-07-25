import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/ExerciseCalendar.css';
import { api } from '../api/Api.js';

const ExerciseCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [presentDays, setPresentDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      try {
        const response = await api.get(`/workout-records/monthly?month=${year}-${month}`);
        const data = response.data;
        setPresentDays(data.presentDays.map(day => {
          const [year, month, date] = day.split('-');
          return new Date(year, month - 1, date);
        }));
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
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && presentDays.some(d => isSameDay(d, date))) {
      return 'exercise-present-day';
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && presentDays.some(d => isSameDay(d, date))) {
      return <div className="exercise-highlight-dot"></div>;
    }
    return null;
  };

  const handleDateClick = async (value) => {
    const selectedDate = new Date(value.getFullYear(), value.getMonth(), value.getDate());
    setSelectedDate(selectedDate);
    setLoading(true);
    setError(null);

    const dateString = selectedDate.toLocaleDateString('en-CA'); // 'en-CA' 형식은 YYYY-MM-DD로 변환합니다
    try {
      const response = await api.get(`/workout-records/daily?date=${dateString}`);
      setDailyRecords(response.data.records);
    } catch (error) {
      setError('Failed to fetch daily records.');
      setDailyRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exercise-calendar-page">
      <div className="exercise-calendar-container">
        <div className="exercise-custom-header">
          <h1 className="exercise-custom-title">운동 달력</h1>
        </div>
        <div className="exercise-calendar-content">
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
        <div className="daily-records">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            dailyRecords.length > 0 ? (
              <ul>
                {dailyRecords.map((record, index) => (
                  <li key={index}>
                    <p>운동 타입: {record.exerciseType}</p>
                    <p>라운드: {record.rounds}</p>
                    <p>시간: {record.duration}</p>
                    <p>등급: {record.rating}</p>
                    <p>성공 여부: {record.success ? '성공' : '실패'}</p>
                    <p>내용: {record.recordContent}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>운동 기록이 없습니다.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCalendar;