import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import '../styles/MyPage.css';

const MyPage = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="mypage-page">
      <h2 className="mypage-title">회원정보</h2>
      <div className="mypage-container">
        <div className="mypage-user-info">
          <div className="mypage-user-details">
            <div>
              <div className="mypage-branch-name">[{user?.branchName}]</div>
              <div className="mypage-username">{user?.name}</div>
            </div>
          </div>
        </div>
        <h2 className="mypage-title">최근 인바디 정보</h2>
        <div className="mypage-body-info">
          <div className="mypage-body-info-row">
            <div>체중</div>
            <div>근육량</div>
            <div>체지방량</div>
          </div>
          <div className="mypage-body-info-row">
            <div>92</div>
            <div>43.4</div>
            <div>17.9</div>
          </div>
        </div>
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
