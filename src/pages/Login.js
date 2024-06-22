import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';
import '../styles/Login.css';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      navigate('/main');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { userId, password };

    try {
      const response = await api.post('/auth/login', formData);

      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.users || {};

        // 토큰을 디코딩하여 권한 확인
        const decoded = jwtDecode(token);
        const { status } = decoded;

        if (status === 'WAIT' || status === 'STOP') {
          alert('접근 권한이 없습니다.');
          return; // 리다이렉트 없이 함수 종료
        }

        if (stayLoggedIn) {
          localStorage.setItem('token', token);
          localStorage.setItem('userName', user.name || '');
          localStorage.setItem('userRoles', JSON.stringify(user.roles || []));
        } else {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('userName', user.name || '');
          sessionStorage.setItem('userRoles', JSON.stringify(user.roles || []));
        }

        // 저장된 토큰을 확인하기 위한 콘솔 로그
        console.log('JWT Token:', token);

        navigate('/main');
      } else {
        alert('로그인에 실패했습니다: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <div className="login-page container">
      <div id="loginBox">
        <div id="loginBoxTitle">PASSIONATE ATHLETE</div>
        <div id="inputBox">
          <form id="loginForm" onSubmit={handleSubmit}>
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
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
            </div>
            <div className="input-form-box">
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="비밀번호"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="input-form-box">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="stayLoggedIn"
                  name="stayLoggedIn"
                  checked={stayLoggedIn}
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="stayLoggedIn">로그인 상태 유지</label>
              </div>
            </div>
            <div className="button-login-box">
              <button type="submit" id="loginButton" className="btn btn-primary btn-block">
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="login-links">
        <a href="#!" className="link">비밀번호 찾기</a>
        <a href="#!" className="link">아이디 찾기</a>
        <a href="/register" className="link">회원가입</a>
      </div>
    </div>
  );
};

export default Login;
