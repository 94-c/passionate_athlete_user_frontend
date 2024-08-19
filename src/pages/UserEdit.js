import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { api } from '../api/Api.js';
import { UserContext } from '../contexts/UserContext';
import '../styles/UserEdit.css';

const UserEdit = () => {
  const { user: currentUser } = useContext(UserContext);
  const [form, setForm] = useState({
    userId: '',
    password: '',
    passwordCheck: '',
    name: '',
    gender: 'FEMALE',
    weight: '',
    height: '',
    birthDate: '',
    phoneNumber: '',
    branchName: '',
  });
  const [branches, setBranches] = useState([]);
  const [errors, setErrors] = useState({
    password: '',
    passwordCheck: '',
    birthDate: '',
    phoneNumber: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/users');
        const data = response.data;
        setForm({
          userId: data.userId,
          name: data.name,
          password: '',
          passwordCheck: '',
          gender: data.gender,
          weight: data.weight,
          height: data.height,
          birthDate: data.birthDate,
          phoneNumber: data.phoneNumber,
          branchName: data.branchName,
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchBranches = async () => {
      try {
        const response = await api.get('/branches');
        setBranches(response.data);
      } catch (error) {
        console.error('지점 데이터 가져오기 오류:', error);
      }
    };

    fetchUserInfo();
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));

    // Password validation
    if (name === 'password' || name === 'passwordCheck') {
      setTimeout(() => { // Use a timeout to ensure the state is updated
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
      }, 0);
    }

    if (name === 'birthDate' && !/^\d{6}$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthDate: '생년월일은 6자리 숫자여야 합니다.'
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthDate: ''
      }));
    }

    if (name === 'phoneNumber' && !/^\d{11}$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: '휴대폰 번호는 11자리 숫자여야 합니다.'
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await api.put('/users', form);
      if (response.status === 200) {
        alert('회원정보가 성공적으로 수정되었습니다.');
        navigate('/mypage');
      } else {
        alert('회원정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      alert('회원정보 수정에 실패했습니다.');
    }
  };

  const handleBackClick = () => {
    navigate('/mypage');
  };

  const handleCheckClick = () => {
    handleSubmit(new Event('submit'));
  };

  return (
    <div className="user-edit-page">
      <div className="user-edit-header">
        <button className="user-edit-back-button" onClick={handleBackClick}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="user-edit-title">회원 정보 수정</h1>
        <button className="user-edit-check-button" onClick={handleCheckClick}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
      <form className="user-edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <input type="text" id="userId" name="userId" value={form.userId} disabled />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="passwordCheck">비밀번호 확인</label>
            <input type="password" id="passwordCheck" name="passwordCheck" value={form.passwordCheck} onChange={handleChange} />
          </div>
        </div>
        {errors.passwordCheck && <div className="error">{errors.passwordCheck}</div>}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input type="text" id="name" name="name" value={form.name} disabled />
          </div>
          <div className="form-group">
            <label>성별</label>
            <div className="gender-buttons">
              <button type="button" className={`gender-button ${form.gender === 'MALE' ? 'active' : ''}`} onClick={() => setForm({ ...form, gender: 'MALE' })}>남성</button>
              <button type="button" className={`gender-button ${form.gender === 'FEMALE' ? 'active' : ''}`} onClick={() => setForm({ ...form, gender: 'FEMALE' })}>여성</button>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">키</label>
            <input type="number" id="height" name="height" value={form.height} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="weight">체중</label>
            <input type="number" id="weight" name="weight" value={form.weight} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">생년월일</label>
          <input type="text" id="birthDate" name="birthDate" value={form.birthDate} onChange={handleChange} />
          {errors.birthDate && <div className="error">{errors.birthDate}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">휴대폰 번호</label>
          <input type="text" id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="branchName">지점명</label>
          <select id="branchName" name="branchName" value={form.branchName} onChange={handleChange}>
            <option value="">지점 선택</option>
            {branches.map(branch => (
              <option key={branch.name} value={branch.name}>{branch.name}</option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
