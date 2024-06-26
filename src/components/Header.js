import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';
import '../styles/Header.css';

const Header = () => {
  const { user } = useContext(UserContext);
  const [continuousAttendance, setContinuousAttendance] = useState(0);

  useEffect(() => {
    const fetchContinuousAttendance = async () => {
      if (user) {
        try {
          const response = await api.get('/attendances/continue');
          setContinuousAttendance(response.data.continuousAttendanceCount);
        } catch (error) {
          console.error('Error fetching continuous attendance:', error);
        }
      }
    };

    fetchContinuousAttendance();
  }, [user]);

  return (
    <div className="header-container">
      <div className="info-section">
        <p className="attendance-info">
          {user ? (
            <span>
              <span className="branch-name"> [{user.branchName}] </span>
              <span> {user.name} 님은 연속 </span>
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
