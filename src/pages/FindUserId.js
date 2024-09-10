import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/FindUserId.css';

const FindUserId = () => {
    const [form, setForm] = useState({
        name: '',
        phoneNumber: '',
        birthDate: '',
    });
    const [userId, setUserId] = useState('');
    const [errors, setErrors] = useState({});
    const [isFound, setIsFound] = useState(false);
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!value) {
                    error = '이름을 입력하세요.';
                }
                break;
            case 'phoneNumber':
                if (!value) {
                    error = '휴대폰 번호를 입력하세요.';
                } else if (!/^\d{11}$/.test(value)) {
                    error = '휴대폰 번호는 11자리 숫자여야 합니다.';
                }
                break;
            case 'birthDate':
                if (!value) {
                    error = '생년월일을 입력하세요.';
                } else if (!/^\d{6}$/.test(value)) {
                    error = '생년월일은 6자리 숫자여야 합니다.';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const validateForm = (fields) => {
        const errors = {};
        let isValid = true;

        fields.forEach((field) => {
            const error = validateField(field, form[field]);
            if (error) {
                errors[field] = error;
                isValid = false;
            }
        });

        setErrors(errors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        const error = validateField(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm(['name', 'phoneNumber', 'birthDate'])) {
            try {
                const response = await api.post('/auth/find-user-id', {
                    name: form.name,
                    phoneNumber: form.phoneNumber,
                    birthDate: form.birthDate,
                });

                if (response.status === 200 && response.data.userId) {
                    setUserId(response.data.userId);
                    setIsFound(true);
                } else {
                    alert('입력하신 정보가 일치하지 않습니다.');
                    setErrors({
                        name: '입력하신 정보가 일치하지 않습니다.',
                        phoneNumber: '입력하신 정보가 일치하지 않습니다.',
                        birthDate: '입력하신 정보가 일치하지 않습니다.',
                    });
                }
            } catch (error) {
                console.error('Find User ID Error:', error);
                alert('사용자 아이디 찾기 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="find-user-id-page container">
            <div id="findUserIdBox">
                <div id="findUserIdBoxTitle">아이디 찾기</div>
                <form id="findUserIdForm" onSubmit={handleSubmit}>
                    {!isFound ? (
                        <>
                            <div className="input-form-box">
                                <div className="input-with-icon">
                                    <i className="fas fa-user input-icon"></i>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        placeholder="이름"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.name && <div className="error-message">{errors.name}</div>}
                            </div>
                            <div className="input-form-box">
                                <div className="input-with-icon">
                                    <i className="fas fa-phone input-icon"></i>
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        className="form-control"
                                        placeholder="휴대폰 번호 ( '-' 를 제외한 11자리)"
                                        required
                                        value={form.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
                            </div>
                            <div className="input-form-box">
                                <div className="input-with-icon">
                                    <i className="fas fa-calendar input-icon"></i>
                                    <input
                                        type="text"
                                        id="birthDate"
                                        name="birthDate"
                                        className="form-control"
                                        placeholder="생년월일 (6자리)"
                                        required
                                        value={form.birthDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.birthDate && <div className="error-message">{errors.birthDate}</div>}
                            </div>
                        </>
                    ) : (
                        <div className="result-box">
                            <p>찾으신 아이디는</p>
                            <p><strong>{userId}</strong> 입니다.</p>
                        </div>
                    )}
                    <div className="button-register-box">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')}>로그인</button>
                        {!isFound && <button type="submit" className="btn btn-primary">아이디 찾기</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FindUserId;
