import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Head from './components/Head';
import HeadWithTitle from './components/HeadWithTitle';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routers/Router';

import './styles/App.css';
import './styles/Login.css';
import './styles/Register.css';
import './styles/Main.css';
import './styles/Search.css';
import './styles/NoticeForm.css';
import './styles/NoticeDetail.css';

const App = () => {
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  const isMainPage = location.pathname === '/main';
  const isNoticePage = location.pathname === '/notices';
  const isSearchPage = location.pathname === '/search';
  const isNotficeFormPage = location.pathname === '/notices-insert';
  const isNoticeDetailPage = location.pathname.startsWith('/notices/');

  const handleToggleFooter = (isOpen) => {
    setIsFooterOpen(isOpen);
  };

  return (
    <div id="root" className={isFooterOpen ? 'footer-open' : ''}>
      {isAuthPage ? (
        <div className="container">
          <AppRoutes />
        </div>
      ) : isNoticePage ? (
        <>
          <HeadWithTitle title="Notice" />
          <AppRoutes />
          <Footer onToggle={handleToggleFooter} />
        </>
      ) : isSearchPage ? (
        <>
          <AppRoutes />
          <Footer onToggle={handleToggleFooter} />
        </>
      ) : isNotficeFormPage ? (
        <div id="root">
          <AppRoutes />
        </div>
      ) : isNoticeDetailPage ? (
        <div id="root">
          <AppRoutes />
        </div>
      ) : (
        <>
          {isMainPage ? <Head /> : <HeadWithTitle title="Lounge" />}
          {isMainPage && <Header />}
          <div className="container">
            <AppRoutes />
          </div>
          <Footer onToggle={handleToggleFooter} />
        </>
      )}
    </div>
  );
};

export default App;
