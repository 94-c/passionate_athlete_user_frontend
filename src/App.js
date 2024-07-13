import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import HeadWithTitle from './components/HeadWithTitle';
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
  const isNoticeFormPage = location.pathname === '/notices/register' || location.pathname === '/inbody/ranking' || location.pathname === '/mypage/user/edit';
  const isNoticeDetailPage = location.pathname.startsWith('/notices/');
  const isAttendancePage = location.pathname === '/attendance' || location.pathname === '/mypage';
  const isInbodyPage = location.pathname === '/inbody' || location.pathname === '/inbody/dashboard' || location.pathname === '/inbody/register' || location.pathname === '/inbody/status';
  const isUserInfoPage = location.pathname === '/mypage/user/info';
  const isExercisePage = location.pathname.startsWith('/exercise');

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

  const getTitle = () => {
    if (isInbodyPage) {
      if (location.pathname === '/inbody/dashboard') {
        return "인바디 - 대시보드";
      } else if (location.pathname === '/inbody') {
        return "인바디";
      } else if (location.pathname === '/inbody/register') {
        return "인바디 - 등록";
      } else if (location.pathname === '/inbody/status') {
        return "인바디 - 통계";
      }
    } else if (isAttendancePage) {
      if (location.pathname === '/attendance') {
        return "캘런더";
      } else if (location.pathname === '/mypage') {
        return "마이";
      }
    } else if (isUserInfoPage) {
      return "회원 정보";
    } else if (isExercisePage) {
      if (location.pathname === '/exercise') {
        return "운동";
      }
      else if (location.pathname === '/exercise/record') {
        return "운동 기록";
      } else if (location.pathname === '/exercise/stats') {
        return "운동 통계";
      } else if (location.pathname === '/exercise/rank') {
        return "운동 랭크";
      } else if (location.pathname === '/exercise/board') {
        return "운동 게시판";
      }
    }
    return "커뮤니티";
  };

  const AuthContent = () => (
    <div className="container">
      <AppRoutes />
    </div>
  );

  const MainContent = () => (
    <UserProvider>
      <div id="root" className={isFooterOpen ? 'footer-open' : ''}>
        {isNoticePage || isAttendancePage || isInbodyPage || isUserInfoPage || isExercisePage ? ( 
          <>
            <HeadWithTitle title={getTitle()} isAttendancePage={isAttendancePage} isInbodyPage={isInbodyPage} isUserInfoPage={isUserInfoPage} />
            <div className="main-page">
              <AppRoutes />
            </div>
          </>
        ) : isSearchPage ? (
          <>
            <div className="main-page">
              <AppRoutes />
            </div>
          </>
        ) : isNoticeFormPage ? (
          <div className="main-page">
            <AppRoutes />
          </div>
        ) : isNoticeDetailPage ? (
          <div className="main-page">
            <AppRoutes />
          </div>
        ) :  (
          <>
            <div className="main-page">
              <AppRoutes />
            </div>
          </>
        )}
        <Footer onToggle={handleToggleFooter} />
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
