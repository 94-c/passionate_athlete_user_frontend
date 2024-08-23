import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../styles/TodayExerciseModal.css';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';

const TodayExerciseModal = ({ show, handleClose }) => {
    const [workouts, setWorkouts] = useState([]);

    const fetchWorkouts = useCallback(async () => {
        if (show) {
            try {
                const now = new Date();
                const hour = now.getHours();

                if (hour < 15) {
                    now.setDate(now.getDate() - 1);
                }

                const date = now.toISOString().split('T')[0];

                const response = await api.get(`/scheduled-workouts/date?date=${date}`);
                setWorkouts(response.data);
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        }
    }, [show]);

    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts]);

    if (!show) {
        return null;
    }

    return (
        <div className="today-modal-overlay">
            <div className="today-modal-content">
                <span className="today-close-button" onClick={handleClose}>&times;</span>
                <h2 className="today-modal-title">오늘의 운동</h2>
                {workouts.length > 0 ? (
                    workouts.map((workout, index) => (
                        <div key={index} className="today-exercise-item">
                            <div className="today-exercise-header">
                                <div className="today-exercise-title">{workout.title}</div>
                                <div className="today-exercise-time">{workout.rounds} ROUNDS / {workout.time}</div>
                            </div>
                            <div className="today-exercise-body">
                                <div className="today-exercise-infos">
                                    {workout.workoutInfos.map((info, i) => (
                                        <div key={i} className="today-exercise-info">
                                            {info.exercise.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="today-exercise-ratings">
                                    <div className="today-ratings-group">
                                        <h4>남자 등급</h4>
                                        {workout.workoutRatings['남']?.map((rating, j) => (
                                            <div key={j} className="today-exercise-rating">
                                                {rating.rating}: {rating.criteria}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="today-ratings-group">
                                        <h4>여자 등급</h4>
                                        {workout.workoutRatings['여']?.map((rating, j) => (
                                            <div key={j} className="today-exercise-rating">
                                                {rating.rating}: {rating.criteria}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-workout-message">
                        <FontAwesomeIcon icon={faFrown} className="no-workout-icon" />
                        <p>오늘의 운동이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodayExerciseModal;
