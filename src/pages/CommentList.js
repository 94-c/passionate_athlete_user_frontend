import React, { useState } from 'react';
import { api } from '../api/Api';

const CommentList = ({ postId, comments, setComments }) => {
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

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

  return (
    <div className="comments-section">
      <h3>댓글</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-author">{comment.userName}</div>
          <div className="comment-date">{comment.createdDate}</div>
          <div className="comment-content">{comment.content}</div>
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
