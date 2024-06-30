// components/TodayExerciseModal.js
import React from 'react';
import Modal from './Modal';
import '../styles/TodayExerciseModal.css';

const TodayExerciseModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} handleClose={handleClose}>
            <h2>오늘의 운동</h2>
            <div className="exercise-list">
                {/* 예시 데이터 */}
                <div className="exercise-item">
                    <div className="exercise-name">푸쉬업</div>
                    <div className="exercise-description">10세트 15회</div>
                </div>
                <div className="exercise-item">
                    <div className="exercise-name">스쿼트</div>
                    <div className="exercise-description">10세트 20회</div>
                </div>
                <div className="exercise-item">
                    <div className="exercise-name">런지</div>
                    <div className="exercise-description">10세트 20회</div>
                </div>
            </div>
        </Modal>
    );
};

export default TodayExerciseModal;
