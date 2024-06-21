import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Head from './components/Head';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
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
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </div>
      {!isAuthPage && <Footer onToggle={handleToggleFooter} />}
    </div>
  );
};

export default App;
