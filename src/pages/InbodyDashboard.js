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
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setIsDatePickerOpen(false);
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

    const getChangeStyle = (value) => {
        return value > 0 ? 'positive' : 'negative';
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="nav-icon-circle" onClick={handlePrevDate}>
                        <FontAwesomeIcon icon={faChevronLeft} className="nav-icon" />
                    </div>
                    <div className="date-display" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                        {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </div>
                    {isDatePickerOpen && (
                        <div className="date-picker-overlay">
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                inline
                                calendarClassName="custom-calendar"
                                dayClassName={() => 'custom-day'}
                            />
                        </div>
                    )}
                    <div className="nav-icon-circle" onClick={handleNextDate}>
                        <FontAwesomeIcon icon={faChevronRight} className="nav-icon" />
                    </div>
                </div>
                <div className="dashboard-content">
                    <div className="dashboard-item">
                        <h3 className="item-title">체중</h3>
                        <div className="value-orange">{data.weight} kg</div>
                        <div className={`change ${getChangeStyle(1.0)}`}>▲ 1.0</div>
                    </div>
                    <div className="dashboard-item">
                        <h3 className="item-title">골격근량</h3>
                        <div className="value-orange">{data.muscleMass} kg</div>
                        <div className={`change ${getChangeStyle(0.9)}`}>▲ 0.9</div>
                    </div>
                    <div className="dashboard-item">
                        <h3 className="item-title">체지방량</h3>
                        <div className="value-orange">{data.bodyFatMass} kg</div>
                        <div className={`change ${getChangeStyle(-0.7)}`}>▼ 0.7</div>
                    </div>
                    <div className="dashboard-item orange-background">
                        <h3>BMI</h3>
                        <div className="value">{data.bmi} kg/m²</div>
                        <div className={`change ${getChangeStyle(0.4)}`}>▲ 0.4</div>
                    </div>
                    <div className="dashboard-item orange-background">
                        <h3>체지방률</h3>
                        <div className="value">{data.bodyFatPercentage} %</div>
                        <div className={`change ${getChangeStyle(1.3)}`}>▲ 1.3</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InbodyDashboard;
