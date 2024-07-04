import React, { useState, useEffect, useContext } from 'react';
import { api } from '../api/Api.js';
import { UserContext } from '../contexts/UserContext';
import '../styles/UserInfo.css';

const UserInfo = () => {
  const { user: currentUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/users');
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const translateRole = (role) => {
    switch (role) {
      case 'MANAGER':
        return '코치';
      case 'ADMIN':
        return '관리자';
      case 'USER':
        return '회원';
      default:
        return role;
    }
  };

  return (
    <div className="user-info-page">
      {userInfo ? (
        <div className="user-info-content">
          <div className="user-info-item">
            <strong>아이디:</strong> {userInfo.userId}
          </div>
          <div className="user-info-row">
            <div className="user-info-item">
              <strong>이름:</strong> {userInfo.name}
            </div>
            <div className="user-info-item">
              <strong>성별:</strong> {userInfo.gender === 'MALE' ? '남성' : '여성'}
            </div>
          </div>
          <div className="user-info-row">
            <div className="user-info-item">
              <strong>키:</strong> {userInfo.height} cm
            </div>
            <div className="user-info-item">
              <strong>체중:</strong> {userInfo.weight} kg
            </div>
          </div>
          <div className="user-info-item">
            <strong>생년월일:</strong> {userInfo.birthDate || '-'}
          </div>
          <div className="user-info-item">
            <strong>휴대폰 번호:</strong> {userInfo.phoneNumber || '-'}
          </div>
          <div className="user-info-row">
            <div className="user-info-item">
              <strong>지점명:</strong> {userInfo.branchName}
            </div>
            <div className="user-info-item">
              <strong>역할:</strong> {userInfo.roles.map(translateRole).join(', ')}
            </div>
          </div>
          <div className="user-info-item">
            <strong>가입일:</strong> {userInfo.createdDate}
          </div>
        </div>
      ) : (
        <div className="loading">로딩 중...</div>
      )}
    </div>
  );
};

export default UserInfo;
