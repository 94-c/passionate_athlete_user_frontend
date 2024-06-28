import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Attendance.css';

const Attendance = () => {
  const [date, setDate] = useState(new Date());

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <Calendar
          onChange={onDateChange}
          value={date}
          calendarType="gregory"
          formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
          locale="ko-KR"
        />
        <button className="attendance-button">출석</button>
      </div>
    </div>
  );
};

export default Attendance;
