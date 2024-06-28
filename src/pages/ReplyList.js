import React, { useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../api/Api';
import { UserContext } from '../contexts/UserContext';

const ReplyList = ({ commentId, noticeId }) => {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [error, setError] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const { user: currentUser } = useContext(UserContext);

  const fetchReplies = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/comments/${commentId}/replies`, {
        params: { page: page - 1, size: 10 }
      });
      setReplies(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError('Error fetching replies');
    } finally {
      setLoading(false);
    }
  }, [commentId]);

  useEffect(() => {
    fetchReplies(currentPage);
  }, [currentPage, fetchReplies]);

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/comments/${commentId}/replies`, { content: newReply, noticeId });
      setReplies([...replies, response.data]);
      setNewReply('');
    } catch (error) {
      setError('Error posting reply');
    }
  };

  const handleEditReplyChange = (e) => {
    setEditedReplyContent(e.target.value);
  };

  const handleEditReply = (reply) => {
    setEditingReplyId(reply.id);
    setEditedReplyContent(reply.content);
  };

  const handleSaveReply = async (replyId) => {
    try {
      const response = await api.put(`/comments/${commentId}/replies/${replyId}`, { content: editedReplyContent });
      setReplies(replies.map(reply => reply.id === replyId ? response.data : reply));
      setEditingReplyId(null);
    } catch (error) {
      setError('Error editing reply');
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await api.delete(`/comments/${commentId}/replies/${replyId}`);
      setReplies(replies.filter(reply => reply.id !== replyId));
    } catch (error) {
      setError('Error deleting reply');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="replies-section">
      <h4>대댓글</h4>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="replies-container">
          {replies && replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply.id} className="reply">
                <div className="reply-header">
                  <div className="reply-author">[{currentUser.branchName}] {reply.userName}</div>
                </div>
                {editingReplyId === reply.id ? (
                  <div className="edit-reply">
                    <textarea
                      className="edit-reply-textarea"
                      value={editedReplyContent}
                      onChange={handleEditReplyChange}
                      required
                    />
                    <div className="edit-reply-actions">
                      <button onClick={() => handleSaveReply(reply.id)}>저장</button>
                      <button onClick={() => setEditingReplyId(null)}>취소</button>
                    </div>
                  </div>
                ) : (
                  <div className="reply-content">{reply.content}</div>
                )}
                  <div className="reply-date">{reply.createdDate}</div>

                {currentUser && currentUser.id === reply.userId && (
                  <div className="reply-actions">
                    <button onClick={() => handleEditReply(reply)}>수정</button>
                    <button onClick={() => handleDeleteReply(reply.id)}>삭제</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>댓글이 없습니다.</div>
          )}
        </div>
      )}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <form onSubmit={handleReplySubmit} className="reply-form">
        <textarea
          value={newReply}
          onChange={handleReplyChange}
          placeholder="대댓글을 입력해주세요..."
          required
        />
        <button type="submit" className="submit-reply">등록</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ReplyList;
