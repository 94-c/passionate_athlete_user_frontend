import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import '../styles/MyPage.css';

const MyPage = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="mypage-page">
      <h2 className="mypage-title">회원 정보</h2>
      <div className="mypage-container">
        <div className="mypage-user-info">
          <div className="mypage-user-details">
            <div>
              <div className="mypage-branch-name">[{user?.branchName}]</div>
              <div className="mypage-username">{user?.name}</div>
            </div>
            <div className="mypage-average-level">
              <div>평균 운동 레벨</div>
              <div className="mypage-level">S</div>
            </div>
          </div>
          <div className="mypage-actions">
            <button className="mypage-edit-button">프로필 수정</button>
            <button className="mypage-password-button">비밀번호 변경</button>
          </div>
        </div>
        <h2 className="mypage-title">회원권 정보</h2>
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
