// MemberShipPauseHistoryModal.js
import React from 'react';
import '../styles/MemberShipHistoryModal.css';

const MemberShipPauseHistoryModal = ({ isOpen, onClose, record }) => {
  if (!isOpen) return null;

  return (
    <div className="membership-modal-overlay" onClick={onClose}>
      <div className="membership-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="membership-close-button" onClick={onClose}>X</button>
        <h3 className="membership-modal-title">회원권 정지 히스토리 상세</h3>
        <table className="membership-modal-table">
          <tbody>
            <tr>
              <th>정지 시작 날짜</th>
              <td>{record.pauseStartDate}</td>
            </tr>
            <tr>
              <th>정지 종료 날짜</th>
              <td>{record.pauseEndDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberShipPauseHistoryModal;
