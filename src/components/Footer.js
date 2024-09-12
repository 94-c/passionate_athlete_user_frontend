import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faCalendarAlt, faUser, faSync, faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import '../styles/Footer.css';

const Footer = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        onToggle(!isOpen);
    };

    const handleLogout = () => {
        // 로그아웃 시 모든 관련 데이터 삭제
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRoles');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userRoles');

        // 로그인 페이지로 리다이렉트
        navigate('/login', { replace: true });
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleBackNavigation = () => {
        if (window.history.length > 1) {
            navigate(-1);  // 이전 페이지로 이동
        } else {
            navigate('/main');  // 기본 페이지로 이동
        }
    };

    return (
        <div className={`footer ${isOpen ? 'open' : ''}`} onClick={handleToggle}>
            <div className="menu-bar">
                <div className="menu-item" onClick={() => handleNavigate('/notices')}>
                    <FontAwesomeIcon icon={faUserFriends} />
                    <div className="menu-text">커뮤니티</div>
                </div>
                <div className="menu-item" onClick={() => handleNavigate('/attendance')}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <div className="menu-text">캘린더</div>
                </div>
                <div className="menu-item" onClick={() => handleNavigate('/mypage')}>
                    <FontAwesomeIcon icon={faUser} />
                    <div className="menu-text">마이</div>
                </div>
                {location.pathname === '/main' ? (
                    <div className="menu-item" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSync} />
                        <div className="menu-text">로그아웃</div>
                    </div>
                ) : (
                    <div className="menu-item" onClick={() => handleNavigate('/main')}>
                        <FontAwesomeIcon icon={faHome} />
                        <div className="menu-text">홈으로</div>
                    </div>
                )}
            </div>
            {isOpen && (
                <div
                    className="footer-text"
                    onClick={() => window.open('https://www.instagram.com/passionate_athlete_official?igsh=MTdjZ2lmdXJoMWljeQ%3D%3D&utm_source=qr', '_blank')}
                >
                    @passionate_athlete_official
                </div>
            )}
        </div>
    );
};

export default Footer;
