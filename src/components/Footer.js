import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faBell, faUser, faSync, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleToggle = () => {
        setIsOpen(!isOpen);
        onToggle(!isOpen); // 부모 컴포넌트로 상태를 전달
    };

    const handleLogout = () => {
        // JWT 토큰 삭제
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('userName');

        // 로그인 페이지로 이동
        navigate('/login', { replace: true });
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className={`footer ${isOpen ? 'open' : ''}`} onClick={handleToggle}>
            <div className="menu-bar">
                <div className="menu-item" onClick={() => handleNavigate('/noti')}>
                    <FontAwesomeIcon icon={faUserFriends} />
                </div>
                <div className="menu-item">
                    <FontAwesomeIcon icon={faBell} />
                </div>
                <div className="menu-item">
                    <FontAwesomeIcon icon={faUser} />
                </div>
                {location.pathname === '/main' ? (
                    <div className="menu-item" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSync} />
                    </div>
                ) : (
                    <div className="menu-item" onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                )}
            </div>
            {isOpen && (
                <div className="footer-text">
                    관리자
                </div>
            )}
        </div>
    );
};

export default Footer;
