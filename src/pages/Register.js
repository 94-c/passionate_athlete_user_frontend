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
    const [errors, setErrors] = useState({});
    const [isUserIdChecked, setIsUserIdChecked] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await api.get('/branches');
                setBranches(response.data);
            } catch (error) {
                console.error('지점 데이터 가져오기 오류:', error);
            }
        };

        fetchBranches();
    }, []);

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
            case 'password':
            case 'passwordCheck':
                if (!value) {
                    error = '패스워드를 입력하세요.';
                } else if (value.length < 8) {
                    error = '패스워드는 최소 8자 이상이어야 합니다.';
                } else if (name === 'passwordCheck' && value !== form.password) {
                    error = '비밀번호가 일치하지 않습니다.';
                }
                break;
            case 'name':
                if (!value) {
                    error = '이름을 입력하세요.';
                }
                break;
            case 'weight':
            case 'height':
                if (!value) {
                    error = `${name === 'weight' ? '체중' : '키'}을(를) 입력하세요.`;
                }
                break;
            case 'birthDate':
                if (!value) {
                    error = '생년월일을 입력하세요.';
                } else if (!/^\d{6}$/.test(value)) {
                    error = '생년월일은 6자리 숫자여야 합니다.';
                }
                break;
            case 'phoneNumber':
                if (!value) {
                    error = '휴대폰 번호를 입력하세요.';
                } else if (!/^\d{11}$/.test(value)) {
                    error = '휴대폰 번호는 11자리 숫자여야 합니다.';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        const error = validateField(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

        if (name === 'userId') {
            setIsUserIdChecked(false);
            if (!error) {
                try {
                    const response = await api.get('/auth/check-userid', {
                        params: { userId: value }
                    });

                    if (response.data) {
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
            }
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step === 1) {
            const step1Fields = ['userId', 'password', 'passwordCheck', 'name', 'branchName'];
            const step1Errors = {};
            let isValidStep1 = true;

            step1Fields.forEach(field => {
                const error = validateField(field, form[field]);
                if (error) {
                    step1Errors[field] = error;
                    isValidStep1 = false;
                }
            });

            setErrors(step1Errors);

            if (isValidStep1 && isUserIdChecked) {
                setStep(2);
            } else {
                alert('다음 문제를 해결해주세요:\n' +
                    (step1Errors.userId ? `- ${step1Errors.userId}\n` : '') +
                    (step1Errors.passwordCheck ? `- ${step1Errors.passwordCheck}\n` : '') +
                    (step1Errors.name ? `- ${step1Errors.name}\n` : '') +
                    (!isUserIdChecked ? '- 아이디 중복 확인을 해주세요.\n' : ''));
            }
        } else if (step === 2) {
            const step2Fields = ['weight', 'height', 'birthDate', 'phoneNumber'];
            const step2Errors = {};
            let isValidStep2 = true;

            step2Fields.forEach(field => {
                const error = validateField(field, form[field]);
                if (error) {
                    step2Errors[field] = error;
                    isValidStep2 = false;
                }
            });

            setErrors(step2Errors);

            if (isValidStep2) {
                try {
                    const response = await api.post('/auth/register', form);
                    if (response.status === 200) {
                        alert('회원가입에 완료하였습니다.');
                        navigate('/login');
                    } else {
                        alert('회원가입에 실패했습니다: ' + (response.data.message || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('회원가입에 실패했습니다.');
                }
            } else {
                alert('다음 문제를 해결해주세요:\n' +
                    (step2Errors.weight ? `- ${step2Errors.weight}\n` : '') +
                    (step2Errors.height ? `- ${step2Errors.height}\n` : '') +
                    (step2Errors.birthDate ? `- ${step2Errors.birthDate}\n` : '') +
                    (step2Errors.phoneNumber ? `- ${step2Errors.phoneNumber}\n` : ''));
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
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    {errors.userId && <div className="error-message">{errors.userId}</div>}
                                </div>
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
                                {errors.passwordCheck && <div className="error-message">{errors.passwordCheck}</div>}
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
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    {errors.name && <div className="error-message">{errors.name}</div>}
                                </div>
                                <div className="input-form-box">
                                    <div className="input-with-icon">
                                        <i className="fas fa-building"></i>
                                        <select
                                            id="branchName"
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
                                        <i className="fas fa-ruler-vertical"></i>
                                        <input
                                            type="number"
                                            id="height"
                                            name="height"
                                            className="form-control"
                                            placeholder="키 (cm)"
                                            value={form.height}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    <div className="input-with-icon">
                                        <i className="fas fa-weight"></i>
                                        <input
                                            type="number"
                                            id="weight"
                                            name="weight"
                                            className="form-control"
                                            placeholder="몸무게 (kg)"
                                            value={form.weight}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                </div>
                                {errors.weight && <div className="error-message">{errors.weight}</div>}
                                {errors.height && <div className="error-message">{errors.height}</div>}
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
                                            id="birthDate"
                                            name="birthDate"
                                            className="form-control"
                                            placeholder="생년월일 (6자리)"
                                            value={form.birthDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    {errors.birthDate && <div className="error-message">{errors.birthDate}</div>}
                                </div>
                                <div className="input-form-box">
                                    <div className="input-with-icon">
                                        <i className="fas fa-phone"></i>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            className="form-control"
                                            placeholder="휴대폰 번호 ( '-' 를 제외 한 11자리)"
                                            value={form.phoneNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
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
