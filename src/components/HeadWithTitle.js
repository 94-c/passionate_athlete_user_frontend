import React from 'react';
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
    </div>
  );
};

export default HeadWithTitle;
