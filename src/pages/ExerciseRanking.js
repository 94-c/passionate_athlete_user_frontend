import React, { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale, faFemale, faCalendarAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { api } from '../api/Api.js';
import '../styles/ExerciseRanking.css';
import { UserContext } from '../contexts/UserContext.js';

const ExerciseRank = () => {
  const { user: currentUser } = useContext(UserContext);
  const [rankData, setRankData] = useState([]);
  const [gender, setGender] = useState('');
  const [rating, setRating] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const ratingContainerRef = useRef(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const ratings = ["", "SS+", "SS", "S+", "S", "A+", "A", "B+", "B", "C+", "C"];

  useEffect(() => {
    if (currentUser) {
      const userGender = currentUser.gender;
      setGender(userGender);
      fetchRankData(userGender, rating, currentPage);
    }
  }, [currentUser, rating, currentPage, selectedDate]);

  useEffect(() => {
    if (gender && rating !== undefined) {
      fetchRankData(gender, rating, currentPage);
    }
  }, [gender, rating, currentPage, selectedDate]);

  const fetchRankData = async (gender, rating, page) => {
    try {
      const date = selectedDate.toISOString().split('T')[0];
      const decodedRating = decodeURIComponent(rating);

      const params = {
        date,
        gender,
        rating: decodedRating,
        page,
        size: itemsPerPage,
      };

      const response = await api.get('/workout-records/statistics', { params });

      const { content, totalPages } = response.data;
      setRankData(content || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error('Error fetching rank data:', error);
      setRankData([]);
      setTotalPages(1);
    }
  };


  const handleGenderChange = (newGender) => {
    setGender(newGender);
    setCurrentPage(0);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  return (
    <div className="exercise-rank-page">
      <div className="exercise-rank-header">
        <h1 className="exercise-rank-title">운동 랭킹</h1>
        <div className="exercise-rank-gender-buttons">
          <button
            className={gender === 'MALE' ? 'active' : ''}
            onClick={() => handleGenderChange('MALE')}
            data-hover-text="남성"
          >
            <FontAwesomeIcon icon={faMale} />
          </button>
          <button
            className={gender === 'FEMALE' ? 'active' : ''}
            onClick={() => handleGenderChange('FEMALE')}
            data-hover-text="여성"
          >
            <FontAwesomeIcon icon={faFemale} />
          </button>
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="calendar-button"
            data-hover-text="날짜 선택"
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
          </button>
          {isDatePickerOpen && (
            <div className="datepicker-popup">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
              />
            </div>
          )}
        </div>
      </div>
      <div className="rating-tabs-container" ref={ratingContainerRef}>
        <div className="rating-tabs">
          {ratings.map((type) => (
            <button key={type} className={`rating-tab ${rating === type ? 'active' : ''}`} onClick={() => handleRatingChange(type)}>{type === "" ? "모두" : type}</button>
          ))}
        </div>
      </div>
      <div className="exercise-rank-list">
        {rankData.length > 0 ? (
          rankData.map((record, index) => (
            <div key={index} className="rank-item">
              <div className="rank-item-left">
                <h2>[{record.branchName}] {record.userName}</h2>
                <p>등급: {record.rating}</p>
              </div>
              <div className="rank-item-right">
                <p className="duration">{record.duration}</p>
                <p className={`status ${record.success ? 'success' : 'failure'}`}>{record.success ? '성공' : '실패'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-box">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            데이터가 없습니다.
          </div>
        )}
      </div>
      <div className="pagination-buttons">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => handlePageChange(i)} disabled={currentPage === i}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExerciseRank;
