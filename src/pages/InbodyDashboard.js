import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { api } from '../api/Api.js';
import '../styles/InbodyDashboard.css';

const InbodyDashboard = () => {
    const [data, setData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [excludeDates, setExcludeDates] = useState([]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setIsDatePickerOpen(false);
        fetchData(date);
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

    const fetchData = async (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        try {
            const response = await api.get('/physicals/all');
            const physicals = response.data.content;

            const selectedData = physicals.find(item => item.measureDate === formattedDate);

            if (selectedData) {
                setData(selectedData);
                setExcludeDates([]);
            } else {
                setData(null);
                setExcludeDates(physicals.map(item => new Date(item.measureDate)));
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    useEffect(() => {
        fetchData(selectedDate);
    }, []);

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
                                dayClassName={(date) =>
                                    excludeDates.some(d => d.toISOString().split('T')[0] === date.toISOString().split('T')[0])
                                        ? 'custom-day'
                                        : ''
                                }
                                excludeDates={excludeDates}
                            />
                        </div>
                    )}
                    <div className="nav-icon-circle" onClick={handleNextDate}>
                        <FontAwesomeIcon icon={faChevronRight} className="nav-icon" />
                    </div>
                </div>
                <div className="dashboard-content">
                    {data ? (
                        <>
                            <div className="dashboard-item">
                                <h3 className="item-title">체중</h3>
                                <div className="value-orange">{data.weight} kg</div>
                                <div className={`change ${getChangeStyle(data.weightChange)}`}>
                                    {data.weightChange > 0 ? '▲' : '▼'} {Math.abs(data.weightChange)}
                                </div>
                            </div>
                            <div className="dashboard-item">
                                <h3 className="item-title">골격근량</h3>
                                <div className="value-orange">{data.muscleMass} kg</div>
                                <div className={`change ${getChangeStyle(data.muscleMassChange)}`}>
                                    {data.muscleMassChange > 0 ? '▲' : '▼'} {Math.abs(data.muscleMassChange)}
                                </div>
                            </div>
                            <div className="dashboard-item">
                                <h3 className="item-title">체지방량</h3>
                                <div className="value-orange">{data.bodyFatMass} kg</div>
                                <div className={`change ${getChangeStyle(data.bodyFatMassChange)}`}>
                                    {data.bodyFatMassChange > 0 ? '▲' : '▼'} {Math.abs(data.bodyFatMassChange)}
                                </div>
                            </div>
                            <div className="dashboard-item orange-background">
                                <h3>BMI</h3>
                                <div className="value">{data.bmi} kg/m²</div>
                            </div>
                            <div className="dashboard-item orange-background">
                                <h3>체지방률</h3>
                                <div className="value">{data.bodyFatPercentage} %</div>
                            </div>
                        </>
                    ) : (
                        <div className="no-data-message">
                            <strong style={{ color: '#ff6600' }}>{selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</strong>
                            <br />
                            인바디 정보가 존재하지 않습니다. 🥹
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InbodyDashboard;
