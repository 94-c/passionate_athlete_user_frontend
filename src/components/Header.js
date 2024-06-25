import React, { useState, useEffect } from 'react';
import { parseJwt } from '../utils/Jwt.js';
import { api } from '../api/Api.js';
import '../styles/Header.css';

const Header = () => {
  const [userName, setUserName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [continuousAttendance, setContinuousAttendance] = useState(0);

  useEffect(() => {
    // 토큰 가져오기
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = token ? parseJwt(token) : null;

    // 사용자 이름과 지점 이름 가져오기
    if (user) {
      setUserName(user.name);
      setBranchName(user.branchName);
    }

    const fetchContinuousAttendance = async () => {
      if (token) {
        try {
          const response = await api.get('/attendances/continue');
          setContinuousAttendance(response.data.continuousAttendanceCount);
        } catch (error) {
          console.error('Error fetching continuous attendance:', error);
        }
      }
    };

    fetchContinuousAttendance();
  }, []);

  return (
    <div className="header-container">
      <div className="info-section">
        <p className="attendance-info">
          {userName ? (
            <span>
              <span className="branch-name"> [{branchName}] </span>
              <span> {userName} 님은 연속 </span>
              <span className="highlight">{continuousAttendance}</span>
              <span>일 출석 중입니다.</span>
            </span>
          ) : (
            <span>로그인 해주세요.</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Header;
