import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Attendance.css';
import { api } from '../api/Api.js';

const Attendance = () => {
  const [date, setDate] = useState(new Date());
  const [presentDays, setPresentDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceInfo, setAttendanceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    console.log('date1:', date1.toUTCString());
    console.log('date2:', utcDate2.toUTCString());
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
    try {
      const response = await api.get(`/attendances/daily?daily=${selectedDate.toISOString().split('T')[0]}`);
      setAttendanceInfo(response.data);
    } catch (error) {
      setAttendanceInfo(null);
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError("Failed to fetch attendance data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setAttendanceInfo(null);
    setError(null);
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
      </div>
      {selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>출석</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : attendanceInfo ? (
              <p>{attendanceInfo.username} 님의 {selectedDate.toISOString().split('T')[0]}일날 출석하셨습니다.</p>
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
