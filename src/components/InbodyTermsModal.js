// components/InbodyTermsModal.js
import React from 'react';
import Modal from './Modal';
import '../styles/InbodyTermsModal.css';

const InbodyTermsModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} handleClose={handleClose}>
      <h2>인바디 용어 설명</h2>
      <div className="terms-list">
        <div className="term-item">
          <div className="term-title">체중</div>
          <div className="term-description">신체의 총 무게를 나타냅니다.</div>
        </div>
        <div className="term-item">
          <div className="term-title">근육량</div>
          <div className="term-description">신체에 있는 근육의 무게를 나타냅니다.</div>
        </div>
        <div className="term-item">
          <div className="term-title">체지방량</div>
          <div className="term-description">신체에 있는 지방의 무게를 나타냅니다.</div>
        </div>
        <div className="term-item">
          <div className="term-title">BMI</div>
          <div className="term-description">체질량 지수로, 체중(kg)을 키(m)의 제곱으로 나눈 값입니다.</div>
        </div>
        <div className="term-item">
          <div className="term-title">체지방률</div>
          <div className="term-description">체중에서 지방이 차지하는 비율입니다.</div>
        </div>
      </div>
    </Modal>
  );
};

export default InbodyTermsModal;
