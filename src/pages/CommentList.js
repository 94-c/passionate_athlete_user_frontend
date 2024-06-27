import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api';
import { UserContext } from '../contexts/UserContext';

const CommentList = ({ postId, comments = [], setComments }) => {
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const { user: currentUser } = useContext(UserContext);

  const fetchComments = useCallback(async (page) => {
    try {
      const response = await api.get(`/notices/${postId}/comments`, {
        params: {
          page: page,
          size: 5,
        },
      });
      setComments(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError('Error fetching comments');
    }
  }, [postId, setComments]);

  useEffect(() => {
    fetchComments(page);
  }, [fetchComments, page]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/notices/${postId}/comments`, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      setError('Error posting comment');
    }
  };

  const handleEditCommentChange = (e) => {
    setEditedCommentContent(e.target.value);
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  const handleSaveComment = async (commentId) => {
    try {
      const response = await api.put(`/notices/${postId}/comments/${commentId}`, { content: editedCommentContent });
      setComments(comments.map(comment => comment.id === commentId ? response.data : comment));
      setEditingCommentId(null);
    } catch (error) {
      setError('Error editing comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/notices/${postId}/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      setError('Error deleting comment');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleCommentClick = (commentId) => {
    navigate(`/notices/${postId}/comments/${commentId}`);
  };

  return (
    <div className="comments-section">
      <h3>댓글</h3>
      <div className="comments-container">
        {comments.map((comment) => (
          <div key={comment.id} className="comment" onClick={() => handleCommentClick(comment.id)}>
            <div className="comment-header">
              <div className="comment-author">
                [{currentUser.branchName}] {comment.userName}
              </div>
            </div>
            {editingCommentId === comment.id ? (
              <div className="edit-comment">
                <textarea
                  className="edit-comment-textarea"
                  value={editedCommentContent}
                  onChange={handleEditCommentChange}
                  required
                />
                <div className="edit-comment-actions">
                  <button onClick={() => handleSaveComment(comment.id)}>저장</button>
                  <button onClick={() => setEditingCommentId(null)}>취소</button>
                </div>
              </div>
            ) : (
              <div className="comment-content">{comment.content}</div>
            )}
            <div className="comment-date">{comment.createdDate}</div>

            {currentUser && currentUser.id === comment.userId && (
              <div className="comment-actions">
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleEditComment(comment);
                }}>수정</button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteComment(comment.id);
                }}>삭제</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="comment-pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`comment-page-button ${page === index ? 'active' : ''}`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력해주세요..."
          required
        />
        <button type="submit" className="submit-comment">등록</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CommentList;
