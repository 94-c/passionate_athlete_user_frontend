import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';
import '../styles/InbodyRegister.css';

const InbodyRegister = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        muscleMass: '',
        bodyFatMass: ''
    });

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
            const response = await api.post('/physicals', formData);
            if (response.status === 200 || response.status === 201) {
                alert('등록이 완료되었습니다.');
                navigate('/inbody');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert(error.response.data.message);
            } else {
                console.error('Failed to register inbody data', error);
            }
        }
    };

    const fetchLastMeasure = async () => {
        try {
            const response = await api.get('/physicals/last');
            if (response.status === 200) {
                setLastMeasure(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch last measure', error);
        }
    };

    useEffect(() => {
        fetchLastMeasure();
    }, []);

    // 숫자 및 소수점만 입력할 수 있도록 제한하는 함수
    const handleKeyPress = (e) => {
        const charCode = e.charCode;
        // 숫자 (0-9)와 소수점 (.)만 허용
        if (charCode !== 46 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    };

    return (
        <div className="inbody-register-page">
            <form className="inbody-form" onSubmit={handleSubmit}>
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
