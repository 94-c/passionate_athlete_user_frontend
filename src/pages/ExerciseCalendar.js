import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/ExerciseCalendar.css';
import { api } from '../api/Api.js';
import ExerciseDetailModal from '../components/ExerciseDetailModal';

const ExerciseCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [presentDays, setPresentDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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

  const handleRecordClick = (record) => {
    setModalContent(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const formatExerciseType = (type) => {
    switch (type) {
      case 'MODIFIED':
        return '[변형] 변형 운동';
      case 'ADDITIONAL':
        return '[추가] 추가 운동';
      default:
        return '[본운동]';
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
        <div className="daily-records-container">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="daily-records">
              {dailyRecords.length > 0 ? (
                <ul>
                  {dailyRecords.map((record, index) => (
                    <li key={index} className={`daily-record ${record.exerciseType}`} onClick={() => handleRecordClick(record)}>
                      <h3 className="record-title">{formatExerciseType(record.exerciseType)} {record.scheduledWorkoutTitle}</h3>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>운동 기록이 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <ExerciseDetailModal isOpen={isModalOpen} onClose={closeModal} record={modalContent} />
    </div>
  );
};

export default ExerciseCalendar;
