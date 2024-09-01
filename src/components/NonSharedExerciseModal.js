// components/NonSharedExerciseModal.js
import React, { useEffect, useState, useContext } from 'react';
import { api } from '../api/Api.js';
import { UserContext } from '../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/NonSharedExerciseModal.css';

const NonSharedExerciseModal = ({ show, handleClose }) => {
    const { user } = useContext(UserContext);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (show && user) {
            const fetchNonSharedRecords = async () => {
                try {
                    const response = await api.get('/workout-record-notice/non-shared', {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                        params: {
                            page: 0,
                            perPage: 10,
                        },
                    });
                    setRecords(response.data.content);
                } catch (error) {
                    console.error('Error fetching non-shared workout records:', error);
                }
            };

            fetchNonSharedRecords();
        }
    }, [show, user]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // yyyy-mm-dd format
    };

    const formatExerciseType = (type) => {
        switch (type) {
            case 'MAIN':
                return '메인';
            case 'ADDITIONAL':
                return '추가';
            case 'MODIFIED':
                return '변형';
            default:
                return '기타';
        }
    };

    const formatRecordValue = (value) => {
        return value === null || value === '' ? '-' : value;
    };

    if (!show) return null;

    return (
        <div className="sharing-exercise-modal-overlay" onClick={handleClose}>
            <div className="sharing-exercise-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="sharing-exercise-modal-header">
                    <h2 className="modal-title">운동 기록</h2>
                    <button className="sharing-exercise-modal-close" onClick={handleClose}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="sharing-exercise-modal-content">
                    {records.length === 0 ? (
                        <div className="sharing-exercise-no-records-message">
                            <FontAwesomeIcon icon={faFrown} />
                            <p>공유할 수 있는 기록이 없습니다.</p>
                        </div>
                    ) : (
                        <ul className="sharing-exercise-list">
                            {records.map((record, index) => (
                                <div key={index} className="sharing-exercise-item-wrapper">
                                    <li className="sharing-exercise-item">
                                        <div className="sharing-exercise-item-content">
                                            <span className="sharing-exercise-date">{formatDate(record.createdDate)}</span>
                                            <div className="sharing-exercise-details">
                                                <div className="sharing-detail-item">
                                                    <span className="sharing-detail-label">라운드</span>
                                                    <span className="sharing-detail-value">{formatRecordValue(record.rounds)}</span>
                                                </div>
                                                <div className="sharing-detail-item">
                                                    <span className="sharing-detail-label">시간</span>
                                                    <span className="sharing-detail-value">{formatRecordValue(record.duration)}</span>
                                                </div>
                                                <div className="sharing-detail-item">
                                                    <span className="sharing-detail-label">등급</span>
                                                    <span className="sharing-detail-value">{formatRecordValue(record.rating)}</span>
                                                </div>
                                                <div className="sharing-detail-item">
                                                    <span className="sharing-detail-label">성공여부</span>
                                                    <span className={`sharing-detail-value ${record.success ? 'success' : 'failure'}`}>
                                                        {record.success ? '성공' : '실패'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <button className="sharing-exercise-add-button">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NonSharedExerciseModal;
