import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/FindPassword.css';

const FindPassword = () => {
    const [form, setForm] = useState({
        userId: '',
        name: '',
        phoneNumber: '',
        newPassword: '',
        newPasswordCheck: '',
    });
    const [errors, setErrors] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'userId':
                if (!value) {
                    error = '아이디를 입력하세요.';
                } else if (value.length < 4 || value.length > 20) {
                    error = '아이디는 4자 이상 20자 이하여야 합니다.';
                }
                break;
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
            case 'newPassword':
            case 'newPasswordCheck':
                if (!value) {
                    error = '새 비밀번호를 입력하세요.';
                } else if (value.length < 8) {
                    error = '비밀번호는 최소 8자 이상이어야 합니다.';
                } else if (name === 'newPasswordCheck' && value !== form.newPassword) {
                    error = '비밀번호가 일치하지 않습니다.';
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

        if (!isVerified) {
            if (validateForm(['userId', 'name', 'phoneNumber'])) {
                try {
                    const response = await api.post('/auth/verify-user', {
                        userId: form.userId,
                        name: form.name,
                        phoneNumber: form.phoneNumber,
                    });

                    console.log('Response:', response); // 응답 확인용 로그

                    if (response.status === 200 && response.data === true) { // 응답이 true인지 확인
                        setIsVerified(true);
                    } else {
                        alert('입력하신 정보가 일치하지 않습니다.');
                        setErrors({
                            userId: '입력하신 정보가 일치하지 않습니다.',
                            name: '입력하신 정보가 일치하지 않습니다.',
                            phoneNumber: '입력하신 정보가 일치하지 않습니다.'
                        });
                    }
                } catch (error) {
                    console.error('Verification Error:', error);
                    alert('정보 확인 중 오류가 발생했습니다.');
                }
            }
        } else {
            if (validateForm(['newPassword', 'newPasswordCheck'])) {
                try {
                    const response = await api.post('/auth/reset-password', {
                        userId: form.userId,
                        newPassword: form.newPassword,
                    });

                    if (response.status === 200) {
                        alert('비밀번호가 성공적으로 변경되었습니다.');
                        navigate('/login');
                    } else {
                        alert('비밀번호 변경에 실패했습니다.');
                    }
                } catch (error) {
                    console.error('Password Reset Error:', error);
                    alert('비밀번호 변경 중 오류가 발생했습니다.');
                }
            }
        }
    };

    return (
        <div className="find-password-page container">
            <div id="findPasswordBox">
                <div id="findPasswordBoxTitle">비밀번호 찾기</div>
                <form id="findPasswordForm" onSubmit={handleSubmit}>
                    {!isVerified ? (
                        <>
                            <div className="input-form-box">
                                <div className="input-with-icon">
                                    <i className="fas fa-user"></i>
                                    <input
                                        type="text"
                                        id="userId"
                                        name="userId"
                                        className="form-control"
                                        placeholder="아이디"
                                        required
                                        value={form.userId}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.userId && <div className="error-message">{errors.userId}</div>}
                            </div>
                            <div className="input-form-box">
                                <div className="input-with-icon">
                                    <i className="fas fa-user"></i>
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
                                    <i className="fas fa-phone"></i>
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
                        </>
                    ) : (
                        <>
                            <div className="input-form-box">
                                <div className="input-with-icon">
                                    <i className="fas fa-lock"></i>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        className="form-control"
                                        placeholder="새 비밀번호"
                                        required
                                        value={form.newPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                            </div>
                            <div className="input-form-box">
                                <div className="input-with-icon">
                                    <i className="fas fa-lock"></i>
                                    <input
                                        type="password"
                                        id="newPasswordCheck"
                                        name="newPasswordCheck"
                                        className="form-control"
                                        placeholder="새 비밀번호 확인"
                                        required
                                        value={form.newPasswordCheck}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.newPasswordCheck && <div className="error-message">{errors.newPasswordCheck}</div>}
                            </div>
                        </>
                    )}
                    <div className="button-register-box">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')}>취소</button>
                        <button type="submit" className="btn btn-primary">{isVerified ? '비밀번호 변경' : '확인'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FindPassword;
