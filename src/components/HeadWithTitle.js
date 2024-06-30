import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip, faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import InbodyTermsModal from './InbodyTermsModal';
import '../styles/HeadWithTitle.css';

const HeadWithTitle = ({ title, isAttendancePage, isInbodyPage }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleInsertClick = () => {
    navigate('/notices-insert');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleNotificationClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
          <button className="notification-button-head" onClick={handleNotificationClick}>
            <FontAwesomeIcon icon={faBell} />
          </button>
        </div>
      )}
      {!isAttendancePage && !isInbodyPage && (
        <div className="head-buttons">
          {user && user.roles.includes('USER', 'MANAGER', 'ADMIN') && (
            <button className="insert-button-head" onClick={handleInsertClick}>
              <FontAwesomeIcon icon={faPenClip} />
            </button>
          )}
          <button className="search-button-head" onClick={handleSearchClick}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      )}
      <InbodyTermsModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default HeadWithTitle;
