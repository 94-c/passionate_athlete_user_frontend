import React from 'react';
import '../styles/Main.css'; // 수정된 CSS 파일 import
import Head from '../components/Head'; // Head 컴포넌트 import 추가
import Header from '../components/Header'; // Header 컴포넌트 import 추가
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faChartBar, faWeight, faRunning } from '@fortawesome/free-solid-svg-icons';

const Main = () => {
  return (
    <div className="main-page">
      <Head /> {/* Head 컴포넌트 추가 */}
      <Header /> {/* Header 컴포넌트 추가 */}
      <div className="button-container">
        {/* 메인 컴포넌트 내용 추가 */}
        <button className="button-item">
          <FontAwesomeIcon icon={faDumbbell} className="button-icon" />
          <span className="button-title">운동</span>
        </button>
        <button className="button-item">
          <FontAwesomeIcon icon={faChartBar} className="button-icon" />
          <span className="button-title">통계</span>
        </button>
        <button className="button-item">
          <FontAwesomeIcon icon={faRunning} className="button-icon" />
          <span className="button-title">오늘의 운동</span>
        </button>
        <button className="button-item">
          <FontAwesomeIcon icon={faWeight} className="button-icon" />
          <span className="button-title">인바디</span>
        </button>
      </div>
    </div>
  );
};

export default Main;
