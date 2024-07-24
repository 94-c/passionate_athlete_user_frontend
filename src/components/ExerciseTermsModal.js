import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { api } from '../api/Api';
import '../styles/ExerciseTermsModal.css';

const ExerciseTermsModal = ({ show, handleClose }) => {
    const [newExerciseType, setNewExerciseType] = useState('');
    const [newExerciseName, setNewExerciseName] = useState('');

    const handleNewExerciseSubmit = async () => {
        if (!newExerciseType || !newExerciseName) {
            alert('운동 타입과 운동 명을 입력하세요.');
            return;
        }

        try {
            await api.post('/exercises', { type: newExerciseType, name: newExerciseName });
            alert('새로운 운동이 등록되었습니다.');
            handleClose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error('Failed to register new exercise', error);
                alert('새로운 운동 등록에 실패했습니다.');
            }
        }
    };

    return (
        <Modal show={show} handleClose={handleClose}>
            <h2>운동 등록</h2>
            <div className="exercise-form-group">
                <label htmlFor="exerciseType">운동 타입</label>
                <select 
                    id="exerciseType" 
                    value={newExerciseType} 
                    onChange={(e) => setNewExerciseType(e.target.value)}
                    className="exercise-custom-input"
                >
                    <option value="">운동 타입 선택</option>
                    <option value="KETTLEBELL">KETTLEBELL</option>
                    <option value="BARBELL">BARBELL</option>
                    <option value="DUMBBELL">DUMBBELL</option>
                    <option value="BOX">BOX</option>
                    <option value="BALL">BALL</option>
                    <option value="OTHER">OTHER</option>
                </select>
            </div>
            <div className="exercise-form-group">
                <label htmlFor="exerciseName">운동 명</label>
                <input 
                    type="text" 
                    id="exerciseName" 
                    value={newExerciseName} 
                    onChange={(e) => setNewExerciseName(e.target.value)}
                    className="exercise-custom-input"
                />
            </div>
            <div className="exercise-modal-buttons">
                <button onClick={handleNewExerciseSubmit} className="exercise-modal-button exercise-submit-button">등록</button>
            </div>
        </Modal>
    );
};

export default ExerciseTermsModal;
