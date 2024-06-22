// src/components/Header.js
import '../styles/Header.css';
import React from 'react';
import { parseJwt } from '../utils/Jwt.js';
const Header = () => {
  
  const token = localStorage.getItem('token');
  const user = token ? parseJwt(token) : null;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #ccc' }}>
        <div className="info-section" id="info-section" style={{ textAlign: 'right' }}>
          <p className="attendance-info" id="attendance-info">
            {user ? `${user.name} 님은 연속 <span className="highlight">10일</span> 출석 중입니다.` : '로그인 해주세요.'}
          </p>
        </div>
    </div>
  );
};

export default Header;
