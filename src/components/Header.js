import '../styles/Header.css';
import React from 'react';
import { parseJwt } from '../utils/Jwt.js';

const Header = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = token ? parseJwt(token) : null;

  const userName = localStorage.getItem('userName') || sessionStorage.getItem('userName');

  return (
    <div className="header-container">
      <div className="info-section" id="info-section">
        <p className="attendance-info" id="attendance-info" dangerouslySetInnerHTML={{__html: userName ? `${userName} 님은 연속 <span className="highlight">10일</span> 출석 중입니다.` : '로그인 해주세요.'}} />
      </div>
    </div>
  );
};

export default Header;
