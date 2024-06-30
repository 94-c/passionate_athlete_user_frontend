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
    const [availableDates, setAvailableDates] = useState([]);
    const [physicals, setPhysicals] = useState([]);

    const toUTCDate = (date) => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };

    const handleDateChange = (date) => {
        const utcDate = toUTCDate(date);
        setSelectedDate(utcDate);
        setIsDatePickerOpen(false);
        updateDataForDate(utcDate);
    };

    const handlePrevDate = () => {
        const currentIndex = availableDates.findIndex(date => date === selectedDate.toISOString().split('T')[0]);
        if (currentIndex > 0) {
            handleDateChange(new Date(availableDates[currentIndex - 1]));
        }
    };

    const handleNextDate = () => {
        const currentIndex = availableDates.findIndex(date => date === selectedDate.toISOString().split('T')[0]);
        if (currentIndex < availableDates.length - 1) {
            handleDateChange(new Date(availableDates[currentIndex + 1]));
        }
    };

    const getChangeStyle = (value) => {
        return value > 0 ? 'positive' : 'negative';
    };

    const fetchData = async () => {
        try {
            const response = await api.get('/physicals/all');
            const physicalsData = response.data.content.map(item => ({
                ...item,
                measureDate: toUTCDate(new Date(item.measureDate.split('T')[0])),
                weight: parseFloat(item.weight.toFixed(1)),
                height: parseFloat(item.height.toFixed(1)),
                muscleMass: parseFloat(item.muscleMass.toFixed(1)),
                bodyFatMass: parseFloat(item.bodyFatMass.toFixed(1)),
                bmi: parseFloat(item.bmi.toFixed(1)),
                bodyFatPercentage: parseFloat(item.bodyFatPercentage.toFixed(1)),
                visceralFatPercentage: parseFloat(item.visceralFatPercentage.toFixed(1)),
                bmr: parseFloat(item.bmr.toFixed(1)),
                weightChange: item.weightChange !== null ? parseFloat(item.weightChange.toFixed(1)) : null,
                heightChange: item.heightChange !== null ? parseFloat(item.heightChange.toFixed(1)) : null,
                muscleMassChange: item.muscleMassChange !== null ? parseFloat(item.muscleMassChange.toFixed(1)) : null,
                bodyFatMassChange: item.bodyFatMassChange !== null ? parseFloat(item.bodyFatMassChange.toFixed(1)) : null
            }));
            setPhysicals(physicalsData);

            const availableDates = physicalsData.map(item => item.measureDate.toISOString().split('T')[0]);
            availableDates.sort();  // 날짜를 오름차순으로 정렬
            setAvailableDates(availableDates);

            // Initialize with the latest date's data
            const latestData = physicalsData.reduce((latest, item) => {
                return new Date(item.measureDate) > new Date(latest.measureDate) ? item : latest;
            }, physicalsData[0]);
            setSelectedDate(toUTCDate(new Date(latestData.measureDate)));
            setData(latestData);
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    const updateDataForDate = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        const selectedData = physicals.find(item => item.measureDate.toISOString().split('T')[0] === formattedDate);
        setData(selectedData || null);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const isPrevDisabled = availableDates.findIndex(date => date === selectedDate.toISOString().split('T')[0]) === 0;
    const isNextDisabled = availableDates.findIndex(date => date === selectedDate.toISOString().split('T')[0]) === availableDates.length - 1;

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className={`nav-icon-circle ${isPrevDisabled ? 'disabled' : ''}`} onClick={!isPrevDisabled ? handlePrevDate : undefined}>
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
                                dayClassName={(date) => {
                                    const dateWithoutTime = toUTCDate(date).toISOString().split('T')[0];
                                    const dayClass = availableDates.includes(dateWithoutTime) ? 'highlighted-day' : '';
                                    return dayClass;
                                }}
                                filterDate={(date) => {
                                    const dateWithoutTime = toUTCDate(date).toISOString().split('T')[0];
                                    return availableDates.includes(dateWithoutTime);
                                }}
                            />
                        </div>
                    )}
                    <div className={`nav-icon-circle ${isNextDisabled ? 'disabled' : ''}`} onClick={!isNextDisabled ? handleNextDate : undefined}>
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
