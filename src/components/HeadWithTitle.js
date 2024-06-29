import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import '../styles/HeadWithTitle.css';

const HeadWithTitle = ({ title, isAttendancePage }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInsertClick = () => {
    navigate('/notices-insert');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div className="head-container-title with-title">
      <h1 className="head-title">
        <Link to="/main" className="title-link">
          {title}
        </Link>
      </h1>
      {!isAttendancePage && (
        <div className="head-buttons">
          {user && user.roles.includes('USER','MANAGER','ADMIN') && (
            <button className="insert-button-head" onClick={handleInsertClick}>
              <FontAwesomeIcon icon={faPenClip} />
            </button>
          )}
          <button className="search-button-head" onClick={handleSearchClick}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HeadWithTitle;
