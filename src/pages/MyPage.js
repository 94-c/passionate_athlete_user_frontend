import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faIdBadge, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [bodyInfo, setBodyInfo] = useState(null);
  const [membershipInfo, setMembershipInfo] = useState(null);

  const fetchInbodyData = useCallback(async () => {
    try {
      const response = await api.get('/physicals/last');
      setBodyInfo(response.data);
    } catch (error) {
      console.error('Error fetching body info:', error);
    }
  }, []);

  const fetchMembershipData = useCallback(async () => {
    try {
      const response = await api.get('/memberships/current');
      setMembershipInfo(response.data);
    } catch (error) {
      console.error('Error fetching membership info:', error);
    }
  }, []);

  useEffect(() => {
    fetchInbodyData();
    fetchMembershipData();
  }, [fetchInbodyData, fetchMembershipData]);

  const formatChange = (value) => {
    if (value == null) {
      return <span className="change">-</span>; // 값이 null 또는 undefined일 경우 대시(-)로 표시
    }
    const roundedValue = value.toFixed(1);
    const isPositive = value > 0;
    const changeClass = isPositive ? 'positive-change' : 'negative-change';
    return (
      <span className={`change ${changeClass}`}>
        {isPositive ? `+${roundedValue}` : roundedValue}
      </span>
    );
  };

  const handleNavigate = (path) => {
    if (path === '/mypage/notifications') {
      alert('현재 이용할 수 없는 페이지입니다.');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="mypage-page">
      <div className="mypage-body-info-header">
        <h2 className="mypage-title">회원 정보</h2>
      </div>
      <div className="user-header">
        <div className="profile-pic">
          {currentUser?.profilePicture ? (
            <img src={currentUser.profilePicture} alt="프로필" />
          ) : (
            <div className="default-profile-pic">
              <FontAwesomeIcon icon={faUser} className="default-profile-icon" />
            </div>
          )}
        </div>
        <div className="user-info">
          <div className="user-name">{currentUser?.name}</div>
          <div className="user-branch">{currentUser?.branchName}</div>
        </div>
      </div>
      <div className="user-actions no-hover">
        <button className="action-item" onClick={() => handleNavigate('/mypage/user/info')}>
          <FontAwesomeIcon icon={faEdit} className="action-icon" />
          <div>회원정보</div>
        </button>
        <button className="action-item" onClick={() => handleNavigate('/mypage/membership')}>
          <FontAwesomeIcon icon={faIdBadge} className="action-icon" />
          <div>회원권</div>
        </button>
        <button className="action-item" onClick={() => handleNavigate('/mypage/notifications')}>
          <FontAwesomeIcon icon={faBell} className="action-icon" />
          <div>공지사항</div>
        </button>
      </div>
      {bodyInfo && (
        <>
          <div className="mypage-body-info-header">
            <h2 className="mypage-title">최근 인바디</h2>
          </div>
          <div className="mypage-body-info hoverable">
            <div className="mypage-body-info-row">
              <div>체중</div>
              <div>골격근량</div>
              <div>체지방량</div>
            </div>
            <div className="mypage-body-info-row">
              <div className="main-number-container">
                <span className="main-number">{bodyInfo.weight}</span>
                {formatChange(bodyInfo.weightChange)}
              </div>
              <div className="main-number-container">
                <span className="main-number">{bodyInfo.muscleMass}</span>
                {formatChange(bodyInfo.muscleMassChange)}
              </div>
              <div className="main-number-container">
                <span className="main-number">{bodyInfo.bodyFatMass}</span>
                {formatChange(bodyInfo.bodyFatMassChange)}
              </div>
            </div>
          </div>
        </>
      )}
      {membershipInfo && (
        <>
          <div className="mypage-body-info-header">
            <h2 className="mypage-title">회원권</h2>
          </div>
          <div className="mypage-body-info hoverable">
            <div className="mypage-body-info-row">
              <div>시작 날짜</div>
              <div>종료 날짜</div>
            </div>
            <div className="mypage-body-info-row">
              <div className="main-number-container">
                <span className="main-number">{membershipInfo.startDate}</span>
              </div>
              <div className="main-number-container">
                <span className="main-number">{membershipInfo.expiryDate}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyPage;
