import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api/Api.js';
import MemberShipPauseHistoryModal from '../components/MemberShipPauseHistoryModal';
import '../styles/MemberShip.css';

const MemberShip = () => {
  const [membershipInfo, setMembershipInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [pauseHistory, setPauseHistory] = useState([]);
  const [pauseDays, setPauseDays] = useState(1);
  const [periodType, setPeriodType] = useState('ONE_MONTH');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPauseHistoryModal, setShowPauseHistoryModal] = useState(false);
  const itemsPerPage = 5;

  const fetchMembershipData = useCallback(async () => {
    try {
      const response = await api.get('/memberships/current');
      setMembershipInfo(response.data);
    } catch (error) {
      console.error('Error fetching membership info:', error);
    }
  }, []);

  const fetchMembershipHistory = useCallback(async () => {
    try {
      const response = await api.get('/memberships/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching membership history:', error);
    }
  }, []);

  const fetchPauseHistory = useCallback(async () => {
    if (membershipInfo) {
      try {
        const response = await api.get(`/memberships/${membershipInfo.id}/pause/history`);
        setPauseHistory(response.data);
      } catch (error) {
        console.error('Error fetching pause history:', error);
      }
    }
  }, [membershipInfo]);

  useEffect(() => {
    fetchMembershipData();
    fetchMembershipHistory();
  }, [fetchMembershipData, fetchMembershipHistory]);

  useEffect(() => {
    fetchPauseHistory();
  }, [membershipInfo, fetchPauseHistory]);

  const handlePause = async () => {
    try {
      await api.post('/memberships/pause', {
        pauseStartDate: new Date().toISOString().split('T')[0],
        pauseDays: pauseDays,
      });
      alert('회원권이 정지되었습니다.');
      fetchMembershipData();
      fetchPauseHistory();
    } catch (error) {
      console.error('Error pausing membership:', error);
      alert('회원권 정지에 실패했습니다.');
    }
  };

  const handleRenew = async () => {
    try {
      await api.post('/memberships/renew', { periodType: periodType });
      alert('회원권이 갱신되었습니다.');
      fetchMembershipData();
    } catch (error) {
      console.error('Error renewing membership:', error);
      alert('회원권 갱신에 실패했습니다.');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculateDaysUntilRenewal = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleViewPauseHistoryClick = () => {
    setShowPauseHistoryModal(true);
  };

  const handleCloseModal = () => {
    setShowPauseHistoryModal(false);
  };

  return (
    <div className="membership-page">
      <div className="membership-header">
        <h2 className="membership-title">회원권 정보</h2>
        {membershipInfo && (
          <span className="renewal-days">
            D-{calculateDaysUntilRenewal(membershipInfo.expiryDate)}
          </span>
        )}
      </div>
      {membershipInfo && (
        <div className="membership-details">
          <div className="membership-info">
            <div>
              <span>회원권 날짜 : {membershipInfo.startDate}</span> ~ <span>{membershipInfo.expiryDate}</span>
            </div>
          </div>
          <div className="membership-actions">
            <div className="input-group">
              <label>정지 일수:</label>
              <input
                type="number"
                value={pauseDays}
                onChange={(e) => setPauseDays(e.target.value)}
                min="1"
                max="5"
              />
              <button onClick={handlePause}>정지</button>
            </div>
            <div className="input-group">
              <label>갱신 기간:</label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value)}
              >
                <option value="ONE_MONTH">1개월</option>
                <option value="THREE_MONTHS">3개월</option>
                <option value="ONE_YEAR">12개월</option>
              </select>
              <button onClick={handleRenew}>갱신</button>
            </div>
          </div>
        </div>
      )}
      <h2 className="membership-title-left">회원권 히스토리</h2>
      <div className="membership-history">
        {currentItems.length > 0 ? (
          <>
            <table className="membership-history-table">
              <thead>
                <tr>
                  <th>갱신 기간</th>
                  <th>이전 만료 날짜</th>
                  <th>새 만료 날짜</th>
                  <th onClick={handleViewPauseHistoryClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>히스토리</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.createdAt.split('T')[0]}</td>
                    <td>{item.oldExpiryDate}</td>
                    <td>{item.newExpiryDate}</td>
                    <td>
                      <button className="view-button" onClick={handleViewPauseHistoryClick}>보기</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="no-history">히스토리가 없습니다.</div>
        )}
        <div className="pagination">
          {Array.from({ length: Math.ceil(history.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {showPauseHistoryModal && (
        <MemberShipPauseHistoryModal
          isOpen={showPauseHistoryModal}
          onClose={handleCloseModal}
          records={pauseHistory}
        />
      )}
    </div>
  );
};

export default MemberShip;
