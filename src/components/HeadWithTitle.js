import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip, faSearch, faBell, faTrophy, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import InbodyTermsModal from './InbodyTermsModal';
import '../styles/HeadWithTitle.css';

const HeadWithTitle = ({ title, isAttendancePage, isInbodyPage, isUserInfoPage, isUserEditPage }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleInsertClick = () => {
    navigate('/notices/register');
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
    // Logic for completing the edit
    alert('회원 정보 수정 완료'); // Example action
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const hasRole = (roles) => {
    const requiredRoles = ['USER', 'MANAGER', 'ADMIN'];
    return roles.some(role => requiredRoles.includes(role));
  };

  return (
    <div className="head-container-title with-title">
      <h1 className="head-title">
        <Link to="/main" className="title-link">
          {title}
        </Link>
      </h1>
      {isInbodyPage && (
        <div className="head-buttons">
          <button className="ranking-button-head" onClick={handleRankingClick}>
            <FontAwesomeIcon icon={faTrophy} />
          </button>
          <button className="notification-button-head" onClick={handleNotificationClick}>
            <FontAwesomeIcon icon={faBell} />
          </button>
        </div>
      )}
      {!isAttendancePage && !isInbodyPage && !isUserInfoPage && (
        <div className="head-buttons">
          {user && user.roles && (user.roles.includes('USER') || user.roles.includes('MANAGER') || user.roles.includes('ADMIN')) && (
            <button className="insert-button-head" onClick={handleInsertClick}>
              <FontAwesomeIcon icon={faPenClip} />
            </button>
          )}
          <button className="search-button-head" onClick={handleSearchClick}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      )}
      {isUserInfoPage && !isUserEditPage && (
        <div className="head-buttons edit-button-container">
          <button className="edit-button-head" onClick={handleEditClick}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      )}
      {isUserEditPage && (
        <div className="head-buttons">
          <button className="check-button-head" onClick={handleCheckClick}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      )}
      <InbodyTermsModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default HeadWithTitle;
