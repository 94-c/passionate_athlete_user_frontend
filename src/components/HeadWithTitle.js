import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip, faSearch, faBell, faTrophy, faEdit, faCheck, faPlus, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import InbodyTermsModal from './InbodyTermsModal';
import NonSharedExerciseModal from './NonSharedExerciseModal';
import '../styles/HeadWithTitle.css';

const HeadWithTitle = ({ title, isAttendancePage, isInbodyPage, isUserInfoPage, isUserEditPage, isTimeCapsulePage }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showNonSharedModal, setShowNonSharedModal] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false); // State for tooltip visibility

  const handleInsertClick = () => {
    if (isTimeCapsulePage) {
      setShowNonSharedModal(true); 
    } else {
      navigate('/notices/register');
    }
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleNotificationClick = () => {
    setShowModal(true);
  };

  const handleRankingClick = () => {
    navigate('/inbody/ranking');
  };

  const handleEditClick = () => {
    navigate('/mypage/user/edit');
  };

  const handleCheckClick = () => {
    alert('회원 정보 수정 완료');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseNonSharedModal = () => {
    setShowNonSharedModal(false); 
  };

  const hasRole = (roles) => {
    const requiredRoles = ['USER', 'MANAGER', 'ADMIN'];
    return roles.some(role => requiredRoles.includes(role));
  };

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible); // Toggle tooltip visibility
  };

  return (
    <div className="head-container-title-custom with-title">
      <h1 className="head-title-custom">
        <Link to="/main" className="title-link-custom">
          {title}
        </Link>
      </h1>
      <div className="head-buttons-custom">
        {isInbodyPage && (
          <>
            <button className="ranking-button-head-custom" onClick={handleRankingClick}>
              <FontAwesomeIcon icon={faTrophy} />
            </button>
            <button className="notification-button-head-custom" onClick={handleNotificationClick}>
              <FontAwesomeIcon icon={faBell} />
            </button>
          </>
        )}
        {!isAttendancePage && !isInbodyPage && !isUserInfoPage && !isTimeCapsulePage && (
          <>
            {user && user.roles && hasRole(user.roles) && (
              <button className="insert-button-head-custom" onClick={handleInsertClick}>
                <FontAwesomeIcon icon={faPenClip} />
              </button>
            )}
            <button className="search-button-head-custom" onClick={handleSearchClick}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </>
        )}
        {isTimeCapsulePage && (
          <>
            <button className="insert-button-head-custom" onClick={handleInsertClick}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span className={`timecapsule-tooltip-icon-custom ${tooltipVisible ? 'active' : ''}`} onClick={toggleTooltip}>
              <FontAwesomeIcon icon={faQuestionCircle} className="timecapsule-question-icon-custom" />
              {tooltipVisible && (
                <span className="timecapsule-tooltip-text-custom">
                  운동 기록을 <br /> 공유 하는 타임 캡슐입니다.
                </span>
              )}
            </span>
          </>
        )}
        {isUserInfoPage && !isUserEditPage && (
          <button className="edit-button-head-custom" onClick={handleEditClick}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
        {isUserEditPage && (
          <button className="check-button-head-custom" onClick={handleCheckClick}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
      </div>
      <InbodyTermsModal show={showModal} handleClose={handleCloseModal} />
      <NonSharedExerciseModal show={showNonSharedModal} handleClose={handleCloseNonSharedModal} />
    </div>
  );
};

export default HeadWithTitle;
