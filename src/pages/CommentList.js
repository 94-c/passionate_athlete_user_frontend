import React, { useState } from 'react';
import { api } from '../api/Api';

const CommentList = ({ postId, comments, setComments }) => {
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const currentUser = token ? JSON.parse(atob(token.split('.')[1])) : null; // Assuming token is in format 'Bearer xxx.yyy.zzz'

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

  return (
    <div className="comments-section">
      <h3>댓글</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-author">{comment.userName}</div>
          <div className="comment-date">{comment.createdDate}</div>
          {editingCommentId === comment.id ? (
            <div>
              <textarea
                value={editedCommentContent}
                onChange={handleEditCommentChange}
                required
              />
              <button onClick={() => handleSaveComment(comment.id)}>저장</button>
              <button onClick={() => setEditingCommentId(null)}>취소</button>
            </div>
          ) : (
            <div className="comment-content">{comment.content}</div>
          )}
          {currentUser && currentUser.id === comment.userId && (
            <div className="comment-actions">
              <button onClick={() => handleEditComment(comment)}>수정</button>
              <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
            </div>
          )}
        </div>
      ))}
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
