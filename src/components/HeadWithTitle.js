import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../styles/HeadWithTitle.css';

const HeadWithTitle = ({ title }) => {
  return (
    <div className="head-container-title with-title">
      <h1 className="head-title">
        <Link to="/main" className="title-link">
          {title}
        </Link>
      </h1>
      <button className="insert-button-head" onClick={() => window.location.href = '/notices-insert'}>
        <FontAwesomeIcon icon={faPenClip} />
      </button>
      <button className="search-button-head" onClick={() => window.location.href = '/search'}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};

export default HeadWithTitle;
