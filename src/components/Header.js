// src/components/Header.js
import React from 'react';
import { useMediaQuery } from 'react-responsive';

const Header = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      {isMobile ? 'Header Session - Mobile' : 'Header Session - Desktop'}
    </div>
  );
};

export default Header;
