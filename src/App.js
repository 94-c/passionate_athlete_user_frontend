import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Head from './components/Head';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routers/Router';
import './styles/App.css'; // 글로벌 스타일
import './styles/Login.css';
import './styles/Register.css';
import './styles/Main.css';

const App = () => {
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  const handleToggleFooter = (isOpen) => {
    setIsFooterOpen(isOpen);
  };

  return (
    <div id="root" className={isFooterOpen ? 'footer-open' : ''}>
      {!isAuthPage && <Head />}
      {!isAuthPage && <Header />}
      <div className="container">
        <AppRoutes />
      </div>
      {!isAuthPage && <Footer onToggle={handleToggleFooter} />}
    </div>
  );
};

export default App;
