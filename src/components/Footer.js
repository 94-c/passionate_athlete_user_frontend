import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faUserCheck, faUser, faSync, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('userName');

        navigate('/login', { replace: true });
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className={`footer ${isOpen ? 'open' : ''}`} onClick={handleToggle}>
            <div className="menu-bar">
                <div className="menu-item" onClick={() => handleNavigate('/notices')}>
                    <FontAwesomeIcon icon={faUserFriends} />
                    <div className="menu-text">커뮤니티</div>
                </div>
                <div className="menu-item">
                    <FontAwesomeIcon icon={faUserCheck} />
                    <div className="menu-text">출석</div>
                </div>
                <div className="menu-item">
                    <FontAwesomeIcon icon={faUser} />
                    <div className="menu-text">마이</div>
                </div>
                {location.pathname === '/main' ? (
                    <div className="menu-item" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSync} />
                        <div className="menu-text">로그아웃</div>
                    </div>
                ) : (
                    <div className="menu-item" onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <div className="menu-text">이전</div>
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
