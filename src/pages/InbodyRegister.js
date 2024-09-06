import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/InbodyRegister.css';

const InbodyRegister = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        muscleMass: '',
        bodyFatMass: '',
    });

    const [measureDate, setMeasureDate] = useState(new Date());
    const [lastMeasure, setLastMeasure] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/physicals', { ...formData, measureDate });
            if (response.status === 200 || response.status === 201) {
                alert('등록이 완료되었습니다.');
                navigate('/inbody');
            }
        } catch (error) {
            console.error('Failed to register inbody data', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || '오류가 발생했습니다.';
                if (errorMessage.includes('하루에 한번만 입력 하실 수 있습니다.')) {
                    alert('하루에 한번만 입력하실 수 있습니다.');
                } else {
                    alert(errorMessage);
                }
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

    const fetchMeasureForDate = async (date) => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const response = await api.get(`/physicals?measureDate=${formattedDate}`);
            if (response.status === 200) {
                setFormData({
                    height: response.data.height,
                    weight: response.data.weight,
                    muscleMass: response.data.muscleMass,
                    bodyFatMass: response.data.bodyFatMass,
                });
            } else {
                setFormData({
                    height: '',
                    weight: '',
                    muscleMass: '',
                    bodyFatMass: '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch measure for date', error);
            setFormData({
                height: '',
                weight: '',
                muscleMass: '',
                bodyFatMass: '',
            });
        }
    };

    useEffect(() => {
        fetchLastMeasure();
    }, []);

    useEffect(() => {
        fetchMeasureForDate(measureDate);
    }, [measureDate]);

    const handleKeyPress = (e) => {
        const charCode = e.charCode;
        if (charCode !== 46 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    };

    return (
        <div className="inbody-register-page">
            <form className="inbody-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>측정 날짜</label>
                    <DatePicker
                        selected={measureDate}
                        onChange={(date) => setMeasureDate(date)}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        className="date-picker"
                    />
                </div>
                <div className="form-group">
                    <label>키 (cm)</label>
                    <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder={lastMeasure ? `최근: ${lastMeasure.height} cm` : '키 입력'}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>체중 (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder={lastMeasure ? `최근: ${lastMeasure.weight} kg` : '체중 입력'}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>근육량 (kg)</label>
                    <input
                        type="number"
                        name="muscleMass"
                        value={formData.muscleMass}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder={lastMeasure ? `최근: ${lastMeasure.muscleMass} kg` : '근육량 입력'}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>체지방량 (kg)</label>
                    <input
                        type="number"
                        name="bodyFatMass"
                        value={formData.bodyFatMass}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder={lastMeasure ? `최근: ${lastMeasure.bodyFatMass} kg` : '체지방량 입력'}
                        required
                    />
                </div>
                <button type="submit" className="btn-submit">등록</button>
            </form>
        </div>
    );
};

export default InbodyRegister;
