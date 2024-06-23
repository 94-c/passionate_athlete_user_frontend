import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/Register.css';

const Register = () => {
    const [form, setForm] = useState({
        userId: '',
        password: '',
        passwordCheck: '',
        name: '',
        branchName: '', 
        gender: 'FEMALE',
        weight: '',
        height: '',
        birthDate: '', 
        phoneNumber: '', 
        verificationCode: ''
    });
    const [branches, setBranches] = useState([]);
    const [errors, setErrors] = useState({
        userId: '',
        password: '',
        passwordCheck: '',
        name: ''
    });
    const [isUserIdChecked, setIsUserIdChecked] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await api.get('/admin/branches/find-all');
                setBranches(response.data);
            } catch (error) {
                console.error('지점 데이터 가져오기 오류:', error);
            }
        };

        fetchBranches();
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'userId') {
            setIsUserIdChecked(false);
            try {
                const response = await api.post('/auth/check-userid', { userId: value });
                if (response.data.exists) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        userId: '이미 사용 중인 아이디입니다.'
                    }));
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        userId: ''
                    }));
                    setIsUserIdChecked(true);
                }
            } catch (error) {
                console.error('아이디 중복 확인 오류:', error);
            }
        } else if (name === 'password' || name === 'passwordCheck') {
            if (form.password !== form.passwordCheck) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    passwordCheck: '비밀번호가 일치하지 않습니다.'
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    passwordCheck: ''
                }));
            }
        } else if (name === 'name') {
            if (value.length < 2 || value.length > 4) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: '이름은 2글자에서 4글자 사이여야 합니다.'
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: ''
                }));
            }
        }
    };

    const handleBlur = () => {
        if (form.password !== form.passwordCheck) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordCheck: '비밀번호가 일치하지 않습니다.'
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordCheck: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            if (!errors.userId && !errors.passwordCheck && !errors.name && isUserIdChecked) {
                setStep(2);
            } else {
                alert('다음 문제를 해결해주세요:\n' +
                    (errors.userId ? `- ${errors.userId}\n` : '') +
                    (errors.passwordCheck ? `- ${errors.passwordCheck}\n` : '') +
                    (errors.name ? `- ${errors.name}\n` : ''));
            }
        } else if (step === 2) {
            try {
                const response = await api.post('/auth/register', form);
                if (response.status === 200) {
                    alert('회원가입에 완료하였습니다. 관리자에게 권한 요청 드리세요.')
                    navigate('/login');
                } else {
                    alert('회원가입에 실패했습니다: ' + (response.data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('회원가입에 실패했습니다.');
            }
        }
    };

    const handlePrevious = () => {
        if (step === 1) {
            navigate('/login');
        } else {
            setStep(1);
        }
    };

    const handleGenderChange = (gender) => {
        setForm({ ...form, gender });
    };

    return (
        <div className="register-page container">
            <div id="registerBox">
                <div id="registerBoxTitle">회원가입</div>
                <div className="required-notice">* 필수 입력</div>
                <div id="inputBox">
                    <form id="registerForm" onSubmit={handleSubmit}>
                        {step === 1 && (
                            <>
                                <div className="input-form-box id-input-group">
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
                                </div>
                                {errors.userId && <div className="userId-error-message">{errors.userId}</div>}
                                <div className="input-form-box double-input">
                                    <div className="input-with-icon">
                                        <i className="fas fa-lock"></i>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="비밀번호"
                                            required
                                            value={form.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    <div className="input-with-icon">
                                        <i className="fas fa-lock"></i>
                                        <input
                                            type="password"
                                            id="passwordCheck"
                                            name="passwordCheck"
                                            className="form-control"
                                            placeholder="비밀번호 확인"
                                            required
                                            value={form.passwordCheck}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                </div>
                                {errors.passwordCheck && <div className="password-error-message">{errors.passwordCheck}</div>}
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
                                </div>
                                {errors.name && <div className="name-error-message">{errors.name}</div>}
                                <div className="input-form-box">
                                    <div className="input-with-icon">
                                        <i className="fas fa-building"></i>
                                        <select
                                            id="branchName" // branchId를 branchName으로 변경
                                            name="branchName"
                                            className="form-control"
                                            required
                                            value={form.branchName}
                                            onChange={handleChange}
                                        >
                                            <option value="">지점 선택</option>
                                            {branches.map(branch => (
                                                <option key={branch.name} value={branch.name}>{branch.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div className="input-form-box double-input">
                                    <div className="input-with-icon">
                                    <i className="fas fa-weight"></i>
                                        <input
                                            type="number"
                                            id="weight"
                                            name="weight"
                                            className="form-control"
                                            placeholder="키 (cm)"
                                            value={form.weight}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-with-icon">
                                        <i className="fas fa-ruler-vertical"></i>
                                        <input
                                            type="number"
                                            id="height"
                                            name="height"
                                            className="form-control"
                                            placeholder="몸무게 (kg)"
                                            value={form.height}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="input-form-box gender-select">
                                    <div className="gender-buttons">
                                        <button type="button" className={`gender-button male ${form.gender === 'MALE' ? 'active' : ''}`} onClick={() => handleGenderChange('MALE')}>
                                            <i className="fas fa-mars"></i> 남
                                        </button>
                                        <button type="button" className={`gender-button female ${form.gender === 'FEMALE' ? 'active' : ''}`} onClick={() => handleGenderChange('FEMALE')}>
                                            <i className="fas fa-venus"></i> 여
                                        </button>
                                    </div>
                                </div>
                                <div className="input-form-box">
                                    <div className="input-with-icon">
                                        <i className="fas fa-calendar"></i>
                                        <input
                                            type="text"
                                            id="birthDate" // birthdate를 birthDate로 수정
                                            name="birthDate"
                                            className="form-control"
                                            placeholder="생년월일 (6자리)"
                                            value={form.birthDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="input-form-box">
                                    <div className="input-with-icon">
                                        <i className="fas fa-phone"></i>
                                        <input
                                            type="text"
                                            id="phoneNumber" // phone을 phoneNumber로 수정
                                            name="phoneNumber"
                                            className="form-control"
                                            placeholder="휴대폰 번호 ( '-' 를 제외 한 11자리)"
                                            value={form.phoneNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="button-register-box">
                            <button type="button" className="btn btn-secondary btn-block" onClick={handlePrevious}>이전</button>
                            <button type="submit" className="btn btn-primary btn-block">{step === 1 ? '다음' : '회원가입'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
