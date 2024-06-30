import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faCalendarAlt, faUserCheck, faUser, faSync, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
    const { user } = useContext(UserContext); // UseContext를 통해 UserContext 사용

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

    const handleAttendanceClick = async () => {
        try {
            const response = await api.post('/attendances', {}, {
                headers: {
                    Authorization: `Bearer ${user.token}`, // JWT 토큰 포함
                }
            });
            setAttendanceMessage(`${response.data.userName} 님의 ${response.data.attendanceDate}일 출석 완료. 총 출석 횟수: ${response.data.totalAttendanceCount}`);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const message = error.response.data.message;
                const dateMatch = message.match(/\d{4}-\d{2}-\d{2}/);
                const date = dateMatch ? dateMatch[0] : '';
                setAttendanceMessage(`이미 ${date}일에 출석 하셨습니다.`);
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
                    <div className="menu-item" onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <div className="menu-text">이전화면</div>
                    </div>
                )}
            </div>
            {isOpen && (
                <div className="footer-text">
                    관리자
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
