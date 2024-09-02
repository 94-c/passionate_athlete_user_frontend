import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faCalendarAlt, faUserCheck, faUser, faSync, faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/Api.js';
import { UserContext } from '../contexts/UserContext';
import '../styles/Footer.css';

const Footer = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [attendanceMessage, setAttendanceMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        onToggle(!isOpen);
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

    const handleAttendanceClick = async () => {
        try {
            const eventDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd 형식으로 날짜 설정

            const response = await api.post('/attendances', { eventDate });

            setAttendanceMessage(`${response.data.userName} 님의 ${response.data.attendanceDate}일 출석 완료. 총 출석 횟수: ${response.data.totalAttendanceCount}`);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404 || error.response.data.message.includes('이미 해당')) {
                    const message = error.response.data.message;
                    const dateMatch = message.match(/\d{4}-\d{2}-\d{2}/);
                    const date = dateMatch ? dateMatch[0] : '';
                    setAttendanceMessage(`이미 ${date}일에 출석 하셨습니다.`);
                } else {
                    setAttendanceMessage('출석 처리 중 오류가 발생했습니다.');
                }
            } else {
                setAttendanceMessage('출석 처리 중 오류가 발생했습니다.');
            }
        }
        setShowModal(true);
    };


    const closeModal = () => {
        setShowModal(false);
        setAttendanceMessage('');
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
                <div className="menu-item attendance-item" onClick={handleAttendanceClick}>
                    <div className="attendance-icon">
                        <FontAwesomeIcon icon={faUserCheck} />
                    </div>
                    <div className="menu-text">출석</div>
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
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>출석</h2>
                        <p>{attendanceMessage}</p>
                        <button onClick={closeModal}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Footer;
