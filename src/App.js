import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Head from './components/Head';
import HeadWithTitle from './components/HeadWithTitle';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routers/Router';
import Notice from './pages/Notice'; // Notice 컴포넌트를 임포트합니다
import './styles/App.css'; // 글로벌 스타일
import './styles/Login.css';
import './styles/Register.css';
import './styles/Main.css';

const App = () => {
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  const isMainPage = location.pathname === '/main';
  const isNoticePage = location.pathname === '/notice';

  const handleToggleFooter = (isOpen) => {
    setIsFooterOpen(isOpen);
  };

  if (isAuthPage) {
    return (
      <div id="root" className={isFooterOpen ? 'footer-open' : ''}>
        <div className="container">
          <AppRoutes />
        </div>
      </div>
    );
  }

  if (isNoticePage) {
    return (
      <div id="root" className={isFooterOpen ? 'footer-open' : ''}>
        <HeadWithTitle title="Notice" />
        <Notice /> {/* Notice 컴포넌트를 직접 렌더링 */}
        <Footer onToggle={handleToggleFooter} />
      </div>
    );
  }

  return (
    <div id="root" className={isFooterOpen ? 'footer-open' : ''}>
      {isMainPage ? <Head /> : <HeadWithTitle title="Lounge" />}
      {isMainPage && <Header />}
      <div className="container">
        <AppRoutes />
      </div>
      <Footer onToggle={handleToggleFooter} />
    </div>
  );
};

export default App;
