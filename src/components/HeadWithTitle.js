import React from 'react';
import '../styles/HeadWithTitle.css';

const HeadWithTitle = ({ title }) => {
  return (
    <div className="head-container with-title">
      <h1 className="head-title">{title}</h1>
    </div>
  );
};

export default HeadWithTitle;
