import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import { api } from '../api/Api.js';
import '../styles/ExerciseCalendar.css';
import Loading from '../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const ExerciseCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [presentDays, setPresentDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false); // State for tooltip visibility

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
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
        setError('출석 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
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

    const dateString = selectedDate.toLocaleDateString('en-CA');
    try {
      const response = await api.get(`/workout-records/daily?date=${dateString}`);
      setDailyRecords(response.data.records);
    } catch (error) {
      setError('운동 기록을 가져오는 중 오류가 발생했습니다.');
      setDailyRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordClick = async (record) => {
    try {
      const response = await api.get(`/workout-record-histories/${record.id}`);
      const recordWithHistories = response.data;
      setSelectedRecord(recordWithHistories);
    } catch (error) {
      console.error('운동 기록 히스토리를 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const formatRecordValue = (value) => {
    return value === null || value === '' ? '-' : value;
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

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible); // Toggle tooltip visibility
  };

  return (
    <div className="exercise-calendar-page">
      <div className="exercise-calendar-container">
        <div className="exercise-custom-header">
          <h1 className="exercise-custom-title">
            운동 달력
          </h1>
          <span className={`tooltip-icon ${tooltipVisible ? 'active' : ''}`} onClick={toggleTooltip}>
            <FontAwesomeIcon icon={faQuestionCircle} className="question-icon" />
            {tooltipVisible && (
              <span className="tooltip-text">
                당일 15시부터 익일 15시까지 <br />
                해당 날짜의 운동 기록을 확인할 수 있습니다.
              </span>
            )}
          </span>
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
            <Loading />
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
                <div className="no-records-box">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span className="no-records-text">운동 기록이 없습니다.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {selectedRecord && (
        <ExerciseDetailModal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          record={selectedRecord}
        />
      )}
    </div>
  );
};

export default ExerciseCalendar;
