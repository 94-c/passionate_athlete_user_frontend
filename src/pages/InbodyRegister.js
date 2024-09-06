import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';
import '../styles/InbodyRegister.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const InbodyRegister = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        measureDate: new Date(),
        height: '',
        weight: '',
        muscleMass: '',
        bodyFatMass: '',
    });

    const [lastMeasure, setLastMeasure] = useState(null);
    const [excludedDates, setExcludedDates] = useState([]);
    const [tooltipVisible, setTooltipVisible] = useState(false); // State for tooltip visibility

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDateChange = (date) => {
        const isExcluded = excludedDates.some(
            (excludedDate) => excludedDate.toDateString() === date.toDateString()
        );

        if (isExcluded) {
            alert('이미 등록된 날짜입니다. 다른 날짜를 선택해주세요.');
            return;
        }

        setFormData({
            ...formData,
            measureDate: date,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/physicals', formData);
            if (response.status === 200 || response.status === 201) {
                alert('등록이 완료되었습니다.');
                navigate('/inbody');
            }
        } catch (error) {
            console.error('Failed to register inbody data', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || '오류가 발생했습니다.';
                alert(errorMessage);
            } else {
                alert('서버와의 연결에 문제가 발생했습니다.');
            }
        }
    };

    const fetchLastMeasure = async () => {
        try {
            const response = await api.get('/physicals/last');
            if (response.status === 200) {
                setLastMeasure(response.data);
            } else {
                setLastMeasure(null);
            }
        } catch (error) {
            console.error('Failed to fetch last measure', error);
            setLastMeasure(null);
        }
    };

    const fetchExcludedDates = async () => {
        try {
            const response = await api.get('/physicals/date');
            if (response.status === 200) {
                const dates = response.data.map(item => new Date(item.date));
                setExcludedDates(dates);
            }
        } catch (error) {
            console.error('Failed to fetch excluded dates', error);
        }
    };

    useEffect(() => {
        fetchLastMeasure();
        fetchExcludedDates();
    }, []);

    const dayClassName = (date) => {
        const isExcluded = excludedDates.some(
            (excludedDate) => excludedDate.toDateString() === date.toDateString()
        );
        return isExcluded ? 'react-datepicker__day--excluded' : undefined;
    };

    const toggleTooltip = () => {
        setTooltipVisible(prev => !prev); // Toggle tooltip visibility
    };

    return (
        <div className="inbody-register-page">
            <form className="inbody-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="label-with-tooltip">
                        <label>측정 날짜</label>
                        <span className="tooltip-icon-custom" onClick={toggleTooltip}>
                            <FontAwesomeIcon icon={faQuestionCircle} className="question-icon-custom" />
                            {tooltipVisible && (
                                <span className="tooltip-text-custom">
                                    이미 등록된 날짜는 <br /> 선택이 불가합니다.
                                </span>
                            )}
                        </span>
                    </div>
                    <DatePicker
                        selected={formData.measureDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        excludeDates={excludedDates}
                        className="datepicker-input"
                        placeholderText="날짜 선택"
                        dayClassName={dayClassName}
                    />
                </div>
                <div className="form-group">
                    <label>키 (cm)</label>
                    <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder={lastMeasure ? `최근: ${lastMeasure.height} cm` : '키 입력'}
                        required
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>체중 (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder={lastMeasure ? `최근: ${lastMeasure.weight} kg` : '체중 입력'}
                        required
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>근육량 (kg)</label>
                    <input
                        type="number"
                        name="muscleMass"
                        value={formData.muscleMass}
                        onChange={handleChange}
                        placeholder={lastMeasure ? `최근: ${lastMeasure.muscleMass} kg` : '근육량 입력'}
                        required
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>체지방량 (kg)</label>
                    <input
                        type="number"
                        name="bodyFatMass"
                        value={formData.bodyFatMass}
                        onChange={handleChange}
                        placeholder={lastMeasure ? `최근: ${lastMeasure.bodyFatMass} kg` : '체지방량 입력'}
                        required
                        className="input-field"
                    />
                </div>
                <button type="submit" className="btn-submit">등록</button>
            </form>
        </div>
    );
};

export default InbodyRegister;
