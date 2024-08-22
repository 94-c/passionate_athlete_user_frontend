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
  const [selectedDate, setSelectedDate] = useState(null);
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
      fetchInitialRankingData(userGender, rating, currentPage);
    }
  }, [currentUser, rating, currentPage]);

  useEffect(() => {
    if (gender && rating !== undefined) {
      if (selectedDate) {
        fetchFilteredRankingData(gender, rating, selectedDate, currentPage);
      } else {
        fetchInitialRankingData(gender, rating, currentPage);
      }
    }
  }, [gender, rating, currentPage, selectedDate]);

  const fetchInitialRankingData = async (gender, rating, page) => {
    try {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 15) {
        now.setDate(now.getDate() - 1);
      }
      const today = now.toISOString().split('T')[0];
      const response = await api.get('/workout-records/statistics', {
        params: {
          date: today,
          gender: gender,
          rating: decodeURIComponent(rating),
          page: page,
          size: itemsPerPage
        }
      });
      if (response.data && Array.isArray(response.data.content)) {
        setRankData(response.data.content);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setRankData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching ranking data:', error);
      setRankData([]);
      setTotalPages(1);
    }
  };

  const fetchFilteredRankingData = async (gender, rating, selectedDate, page) => {
    try {
      // selectedDate를 기준으로 startDate와 endDate를 설정
      const startDate = new Date(selectedDate);
      startDate.setHours(15, 0, 0, 0); // 검색한 날짜의 오후 3시

      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1); // 다음 날로 설정
      endDate.setHours(14, 59, 59, 999); // 다음 날 오후 2시 59분 59초

      // 타임존 보정을 위해 KST를 고려한 시간을 구하기
      const startDateKST = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000));
      const endDateKST = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000));

      const response = await api.get('/workout-records/rankings/by-date', {
        params: {
          startDate: startDateKST.toISOString(),
          endDate: endDateKST.toISOString(),
          gender: gender,
          rating: decodeURIComponent(rating),
          page: page,
          size: itemsPerPage
        }
      });

      if (response.data && Array.isArray(response.data.content)) {
        setRankData(response.data.content);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setRankData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching filtered ranking data:', error);
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
