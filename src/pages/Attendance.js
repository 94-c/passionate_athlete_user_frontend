import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Attendance.css';

const Attendance = () => {
  const [date, setDate] = useState(new Date());
  const [presentDays, setPresentDays] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const response = await fetch(`/attendances/monthly?month=${year}-${month}`);
      const data = await response.json();
      setPresentDays(data.presentDays.map(day => new Date(day)));
    };

    fetchAttendance();
  }, [date]);

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && presentDays.some(d => d.getTime() === date.getTime())) {
      return 'present-day';
    }
    return null;
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
          />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
