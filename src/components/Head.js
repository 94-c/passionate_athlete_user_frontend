// src/components/Head.js
import React from 'react';
import logo from '../assets/logo.png';
import '../styles/Head.css';

const Head = () => {
  return (
    <div className="head-container">
      <img src={logo} alt="Logo" className="logo" />
    </div>
  );
};

export default Head;
