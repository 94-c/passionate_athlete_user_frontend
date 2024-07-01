import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';
import '../styles/MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [bodyInfo, setBodyInfo] = useState(null);

  const fetchInbodyData = useCallback(async () => {
    try {
      const response = await api.get('/physicals/last');
      setBodyInfo(response.data);
    } catch (error) {
      console.error('Error fetching body info:', error);
    }
  }, []);

  useEffect(() => {
    fetchInbodyData();
  }, [fetchInbodyData]);

  const formatChange = (value) => {
    const roundedValue = value.toFixed(1);
    const isPositive = value > 0;
    const changeClass = isPositive ? 'positive-change' : 'negative-change';
    return (
      <div className={`change ${changeClass}`}>
        {isPositive ? `+${roundedValue}` : roundedValue}
      </div>
    );
  };

  return (
    <div className="mypage-page">
      <h2 className="mypage-title">회원정보</h2>
      <div className="mypage-container">
        <div className="mypage-user-info">
          <div className="mypage-user-details">
            <div>
              <div className="mypage-branch-name">[{currentUser?.branchName}]</div>
              <div className="mypage-username">{currentUser?.name}</div>
            </div>
          </div>
        </div>
        <h2 className="mypage-title">최근 인바디 정보</h2>
        {bodyInfo && (
          <div className="mypage-body-info">
            <div className="mypage-measure-date">
              {new Date(bodyInfo.measureDate).toLocaleDateString()}
            </div>
            <div className="mypage-body-info-row">
              <div>체중</div>
              <div>근육량</div>
              <div>체지방량</div>
            </div>
            <div className="mypage-body-info-row">
              <div>
                <span className="main-number">{bodyInfo.weight}</span>
                {formatChange(bodyInfo.weightChange)}
              </div>
              <div>
                <span className="main-number">{bodyInfo.muscleMass}</span>
                {formatChange(bodyInfo.muscleMassChange)}
              </div>
              <div>
                <span className="main-number">{bodyInfo.bodyFatMass}</span>
                {formatChange(bodyInfo.bodyFatMassChange)}
              </div>
            </div>
          </div>
        )}
        <h2 className="mypage-title">회원권 관리</h2>
        <div className="mypage-membership-info">
          <div className="mypage-membership-dates">
            2024년 07월 02일 ~ 2024년 08월 01일
          </div>
          <div className="mypage-remaining-days">
            현재 30일 남아있습니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
