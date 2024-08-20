import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import { api } from '../api/Api.js';
import '../styles/ExerciseCalendar.css';
import Loading from '../components/Loading'; // Loading 컴포넌트 임포트

const ExerciseCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [presentDays, setPresentDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true); // 로딩 시작
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
        setLoading(false); // 로딩 종료
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
    setLoading(true); // 로딩 시작
    setError(null);

    const dateString = selectedDate.toLocaleDateString('en-CA');
    try {
      const response = await api.get(`/workout-records/daily?date=${dateString}`);
      setDailyRecords(response.data.records);
    } catch (error) {
      setError('운동 기록을 가져오는 중 오류가 발생했습니다.');
      setDailyRecords([]);
    } finally {
      setLoading(false); // 로딩 종료
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
                <p>운동 기록이 없습니다.</p>
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
