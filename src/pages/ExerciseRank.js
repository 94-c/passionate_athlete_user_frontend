import React, { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale, faFemale } from '@fortawesome/free-solid-svg-icons';
import { api } from '../api/Api.js';
import '../styles/ExerciseRank.css';
import { UserContext } from '../contexts/UserContext';

const ExerciseRank = () => {
  const { user: currentUser } = useContext(UserContext); // UserContext를 사용하여 현재 사용자 정보 가져오기
  const [rankData, setRankData] = useState([]);
  const [gender, setGender] = useState('');
  const [rating, setRating] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // 페이지당 항목 수
  const ratingContainerRef = useRef(null); // Ref for the rating tab container

  const ratings = ["", "SS+", "SS", "S+", "S", "A+", "A", "B+", "B", "C+", "C"]; // 등급 리스트

  useEffect(() => {
    if (currentUser) {
      const userGender = currentUser.gender; // UserContext에서 성별 추출
      setGender(userGender);
      fetchRankData(userGender, rating, currentPage);
    }
  }, [currentUser, rating, currentPage]);

  useEffect(() => {
    if (gender) {
      fetchRankData(gender, rating, currentPage);
    }
  }, [gender, rating, currentPage]);

  const fetchRankData = async (gender, rating, page) => {
    try {
      // 현재 날짜와 시간 가져오기
      const now = new Date();
      let date;

      // 현재 시간이 오전 1시부터 오후 4시 사이일 경우 전날 날짜를 사용
      if (now.getHours() < 16) {
        now.setDate(now.getDate() - 1);
      }
      
      // 날짜 형식 설정
      date = now.toISOString().split('T')[0];

      const params = {
        date,
        gender,
        rating,
        page,
        size: itemsPerPage,
      };

      // 콘솔에 파라미터 출력
      console.log('Request Parameters:', params);

      const response = await api.get('/workout-records/statistics', { params });

      // 응답 데이터를 확인하기 위해 콘솔에 출력
      console.log('Response Data:', response.data);

      const { content, totalPages } = response.data;
      setRankData(content || []); // content가 undefined일 경우 빈 배열로 초기화
      setTotalPages(totalPages || 1); // totalPages가 undefined일 경우 1로 초기화
    } catch (error) {
      console.error('Error fetching rank data:', error);
      setRankData([]);
      setTotalPages(1);
    }
  };

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    setCurrentPage(0); // 성별이 변경될 때 페이지를 초기화
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setCurrentPage(0); // 등급이 변경될 때 페이지를 초기화
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="exercise-rank-page">
      <div className="exercise-rank-header">
        <h1 className="exercise-rank-title">데일리 운동 랭킹</h1>
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
          <div className="no-data">데이터가 없습니다.</div>
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
