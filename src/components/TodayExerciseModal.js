// TodayExerciseModal.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import TodayExerciseModalWrapper from './TodayExerciseModalWrapper';
import axios from 'axios';
import '../styles/TodayExerciseModal.css';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';

const TodayExerciseModal = ({ show, handleClose }) => {
    const [workouts, setWorkouts] = useState([]);
    const { user: currentUser } = useContext(UserContext);

    const fetchWorkouts = useCallback(async () => {
        if (show) {
            try {
                const today = new Date().toISOString().split('T')[0];
                const response = await api.get(`/scheduled-workouts/date?date=${today}`);
                setWorkouts(response.data);
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        }
    }, [show]);

    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts]);

    return (
        <TodayExerciseModalWrapper show={show} handleClose={handleClose}>
            <div className="today-modal-content">
                <h2 className="today-modal-title">오늘의 운동</h2>
                {workouts.length > 0 ? (
                    workouts.map((workout, index) => (
                        <div key={index} className="exercise-item">
                            <div className="exercise-header">
                                <div className="exercise-title">{workout.title}</div>
                                <div className="exercise-time">{workout.rounds} ROUNDS / {workout.time}</div>
                            </div>
                            <div className="exercise-body">
                                <div className="exercise-infos">
                                    {workout.workoutInfos.map((info, i) => (
                                        <div key={i} className="exercise-info">{info}</div>
                                    ))}
                                </div>
                                <div className="exercise-ratings">
                                    <div className="ratings-group">
                                        <h4>남자 등급</h4>
                                        {workout.workoutRatings['남']?.map((rating, j) => (
                                            <div key={j} className="exercise-rating">
                                                {rating.rating}: {rating.criteria}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="ratings-group">
                                        <h4>여자 등급</h4>
                                        {workout.workoutRatings['여']?.map((rating, j) => (
                                            <div key={j} className="exercise-rating">
                                                {rating.rating}: {rating.criteria}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>오늘의 운동이 없습니다.</p>
                )}
            </div>
        </TodayExerciseModalWrapper>
    );
};

export default TodayExerciseModal;
