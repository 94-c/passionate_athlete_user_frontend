import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { api } from '../api/Api';
import ReplyList from './ReplyList';
import { UserContext } from '../contexts/UserContext'; 
import '../styles/CommentDetail.css';

const CommentDetail = () => {
  const { noticeId, commentId } = useParams();
  const { user: currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await api.get(`/notices/${noticeId}/comments/${commentId}`);
        setComment(response.data);
      } catch (error) {
        setError('Error fetching comment');
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [noticeId, commentId]);

  const handleBack = () => {
    navigate(`/notices/${noticeId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="comment-detail">
      <div className="comment-detail-header">
        <button type="button" className="back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <h3>댓글 상세보기</h3>
      {comment && (
        <>
          <div className="comment">
            <div className="comment-header">
              <div className="comment-author">[{currentUser.branchName}]{comment.userName}</div>
              <div className="comment-date">{comment.createdDate}</div>
            </div>
            <div className="comment-content">{comment.content}</div>
          </div>
          <ReplyList commentId={comment.id} noticeId={noticeId} />
        </>
      )}
    </div>
  );
};

export default CommentDetail;
