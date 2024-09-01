// components/TimeCapsuleDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHeart } from '@fortawesome/free-solid-svg-icons';
import { api } from '../api/Api';
import { UserContext } from '../contexts/UserContext';
import CommentList from './CommentList';
import Loading from '../components/Loading';
import '../styles/TimeCapsuleDetail.css';

const TimeCapsuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [record, setRecord] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/workout-record-notice/${id}`);
        if (response.data) {
          setRecord(response.data);
          setComments(response.data.comments || []);
          setLikeCount(response.data.likeCount || 0);
          setLiked(response.data.liked || false);
        }
      } catch (error) {
        setError('기록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleBack = () => {
    navigate('/timecapsule');
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/workout-record-notice/${id}/likes`);
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      } else {
        await api.post(`/workout-record-notice/${id}/likes`);
        setLikeCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류가 발생했습니다.', error);
      setError('좋아요 상태를 업데이트하는 데 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) return <Loading />;

  if (error) return <div className="capsule-detail-error">{error}</div>;

  return (
    <div className="capsule-detail-container">
      <div className="capsule-detail-header">
        <button type="button" className="capsule-back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className="capsule-detail-title">{`[${record?.exerciseType || ''}] ${record?.scheduledWorkoutTitle || '운동 기록'}`}</span>
      </div>

      <div className="capsule-profile-section">
        <div className="capsule-profile-info">
          <span className="capsule-profile-username">[{record?.branchName || 'Branch'}] {record?.userName || 'Unknown User'}</span>
          <span className="capsule-profile-timestamp">{record?.createdDate || 'N/A'}</span>
        </div>
      </div>

      <div className="capsule-workout-summary">
        <div className="capsule-summary-item">
          <span className="capsule-summary-label">라운드</span>
          <span className="capsule-summary-value">{record?.rounds || '-'}</span>
        </div>
        <div className="capsule-summary-item">
          <span className="capsule-summary-label">시간</span>
          <span className="capsule-summary-value">{record?.duration || '-'}</span>
        </div>
        <div className="capsule-summary-item">
          <span className="capsule-summary-label">등급</span>
          <span className="capsule-summary-value">{record?.rating || '-'}</span>
        </div>
        <div className="capsule-summary-item">
          <span className="capsule-summary-label">성공여부</span>
          <span className={`capsule-summary-value ${record?.success ? 'success' : 'failure'}`}>
            {record?.success ? '성공' : '실패'}
          </span>
        </div>
      </div>

      <div className="capsule-workout-exercises">
        {record?.histories?.map((history, index) => (
          <div key={index} className="capsule-exercise-item">
            <span className="capsule-exercise-name">{history.exerciseName}</span>
            <div className="capsule-exercise-details">
              <span className="capsule-exercise-rating">{history.rating}</span>
              <span className="capsule-exercise-weight">{history.weight ? `${history.weight} kg` : '- kg'}</span>
              <span className="capsule-exercise-rounds">{history.repetitions} 라운드</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeCapsuleDetail;
