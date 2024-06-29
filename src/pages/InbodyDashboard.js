import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/InbodyDashboard.css';

const InbodyDashboard = () => {
    const [data, setData] = useState({
        weight: 63.5,
        muscleMass: 30.3,
        bodyFatMass: 9.5,
        bmi: 22.0,
        bodyFatPercentage: 15.0,
    });
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        // 실제 데이터 가져오기 구현
    };

    const handlePrevDate = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        handleDateChange(prevDate);
    };

    const handleNextDate = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        handleDateChange(nextDate);
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <FontAwesomeIcon icon={faChevronLeft} className="nav-icon" onClick={handlePrevDate} />
                    <DatePicker 
                        selected={selectedDate} 
                        onChange={handleDateChange} 
                        dateFormat="yyyy.MM.dd HH:mm"
                        showTimeSelect
                        timeFormat="HH:mm"
                        className="date-picker"
                    />
                    <FontAwesomeIcon icon={faChevronRight} className="nav-icon" onClick={handleNextDate} />
                </div>
                <div className="dashboard-content">
                    <div className="dashboard-item">
                        <h3>체중</h3>
                        <div className="value">{data.weight} kg</div>
                        <div className="change">▲ 1.0</div>
                    </div>
                    <div className="dashboard-item">
                        <h3>골격근량</h3>
                        <div className="value">{data.muscleMass} kg</div>
                        <div className="change">▲ 0.9</div>
                    </div>
                    <div className="dashboard-item">
                        <h3>체지방량</h3>
                        <div className="value">{data.bodyFatMass} kg</div>
                        <div className="change">▼ 0.7</div>
                    </div>
                    <div className="dashboard-item">
                        <h3>BMI</h3>
                        <div className="value">{data.bmi} kg/m²</div>
                        <div className="change">▲ 0.4</div>
                    </div>
                    <div className="dashboard-item">
                        <h3>체지방률</h3>
                        <div className="value">{data.bodyFatPercentage} %</div>
                        <div className="change">▲ 1.3</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InbodyDashboard;
