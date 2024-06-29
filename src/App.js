import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Head from './components/Head';
import HeadWithTitle from './components/HeadWithTitle';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routers/Router';
import ErrorBoundary from './components/ErrorBoundary'; 

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
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  const isMainPage = location.pathname === '/main';
  const isNoticePage = location.pathname === '/notices';
  const isSearchPage = location.pathname === '/search';
  const isNoticeFormPage = location.pathname === '/notices-insert';
  const isNoticeDetailPage = location.pathname.startsWith('/notices/');
  const isAttendancePage = location.pathname === '/attendance';

  const handleToggleFooter = (isOpen) => {
    setIsFooterOpen(isOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token && (location.pathname === '/login' || location.pathname === '/')) {
      navigate('/main');
    } else if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const AuthContent = () => (
    <div className="container">
      <AppRoutes />
    </div>
  );

  const MainContent = () => (
    <UserProvider>
      <div id="root" className={isFooterOpen ? 'footer-open' : ''}>
        {isNoticePage || isAttendancePage ? ( 
          <>
            <HeadWithTitle title={isNoticePage ? "커뮤니티" : "출석"} isAttendancePage={isAttendancePage} />
            <AppRoutes />
            <Footer onToggle={handleToggleFooter} />
          </>
        ) : isSearchPage ? (
          <>
            <AppRoutes />
            <Footer onToggle={handleToggleFooter} />
          </>
        ) : isNoticeFormPage ? (
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
    </UserProvider>
  );

  return (
    <ErrorBoundary>
      {isAuthPage ? <AuthContent /> : <MainContent />}
    </ErrorBoundary>
  );
};

export default App;
