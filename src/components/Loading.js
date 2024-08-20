import React from 'react';
import '../styles/Loading.css'; // CSS 파일 추가
import Spinner from '../assets/Spinner.gif';

export default () => {
  return (
    <div className="Background">
      <img src={Spinner} alt="로딩중" width="10%" />
    </div>
  );
};
