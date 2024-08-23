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
    const [editingFields, setEditingFields] = useState({}); // 여러 필드를 수정할 수 있도록 상태 관리
    const [tempValues, setTempValues] = useState({}); // 여러 필드의 임시 값을 관리

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
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return 'neutral';
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
            availableDates.sort(); 
            setAvailableDates(availableDates);
    
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
        setEditingFields({});
        setTempValues({});
    };

    const handleFieldClick = (fieldName) => {
        setEditingFields((prev) => ({ ...prev, [fieldName]: true }));
        setTempValues((prev) => ({ ...prev, [fieldName]: data[fieldName] }));
    };

    const handleInputChange = (fieldName, value) => {
        setTempValues((prev) => ({ ...prev, [fieldName]: parseFloat(value) }));
    };

    const handleUpdate = async () => {
        if (!data.id) {
            console.error("인바디 정보를 찾을 수 없습니다.");
            return;
        }

        // 임시 상태(tempValues)에서 변경된 값을 적용
        const updatedData = { ...data, ...tempValues };

        // BMI와 체지방률을 재계산
        const newBMI = updatedData.weight / ((updatedData.height / 100) ** 2);
        const newBodyFatPercentage = (updatedData.bodyFatMass / updatedData.weight) * 100;

        updatedData.bmi = parseFloat(newBMI.toFixed(1));
        updatedData.bodyFatPercentage = parseFloat(newBodyFatPercentage.toFixed(1));

        setData(updatedData);
        setEditingFields({});
        setTempValues({});

        try {
            await api.put(`/physicals/${data.id}`, updatedData); // 서버로 PUT 요청
        } catch (error) {
            console.error('Failed to save data', error);
        }
    };

    const handleCancel = () => {
        setEditingFields({});
        setTempValues({});
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
                            <div className="dashboard-item" onClick={() => handleFieldClick('weight')}>
                                <h3 className="item-title">체중</h3>
                                {editingFields.weight ? (
                                    <input
                                        type="number"
                                        value={tempValues.weight}
                                        onChange={(e) => handleInputChange('weight', e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    <div className="value-orange">{data.weight} kg</div>
                                )}
                                <div className={`change ${getChangeStyle(data.weightChange)}`}>
                                    {data.weightChange > 0 ? '▲' : data.weightChange < 0 ? '▼' : '-'} {Math.abs(data.weightChange)}
                                </div>
                            </div>
                            <div className="dashboard-item" onClick={() => handleFieldClick('muscleMass')}>
                                <h3 className="item-title">골격근량</h3>
                                {editingFields.muscleMass ? (
                                    <input
                                        type="number"
                                        value={tempValues.muscleMass}
                                        onChange={(e) => handleInputChange('muscleMass', e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    <div className="value-orange">{data.muscleMass} kg</div>
                                )}
                                <div className={`change ${getChangeStyle(data.muscleMassChange)}`}>
                                    {data.muscleMassChange > 0 ? '▲' : data.muscleMassChange < 0 ? '▼' : '-'} {Math.abs(data.muscleMassChange)}
                                </div>
                            </div>
                            <div className="dashboard-item" onClick={() => handleFieldClick('bodyFatMass')}>
                                <h3 className="item-title">체지방량</h3>
                                {editingFields.bodyFatMass ? (
                                    <input
                                        type="number"
                                        value={tempValues.bodyFatMass}
                                        onChange={(e) => handleInputChange('bodyFatMass', e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    <div className="value-orange">{data.bodyFatMass} kg</div>
                                )}
                                <div className={`change ${getChangeStyle(data.bodyFatMassChange)}`}>
                                    {data.bodyFatMassChange > 0 ? '▲' : data.bodyFatMassChange < 0 ? '▼' : '-'} {Math.abs(data.bodyFatMassChange)}
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
                            {(editingFields.weight || editingFields.muscleMass || editingFields.bodyFatMass) && (
                                <div className="edit-buttons">
                                    <button className="save-button" onClick={handleUpdate}>수정</button>
                                    <button className="cancel-button" onClick={handleCancel}>취소</button>
                                </div>
                            )}
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
