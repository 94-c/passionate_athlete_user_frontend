import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faHeart, faSave } from '@fortawesome/free-solid-svg-icons';
import { api } from '../api/Api';
import CommentList from './CommentList';
import '../styles/NoticeDetail.css';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const currentUser = token ? JSON.parse(atob(token.split('.')[1])) : null; // Assuming token is in format 'Bearer xxx.yyy.zzz'

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/notices/${id}`);
        console.log('Post data:', response.data);
        setPost(response.data);
        setComments(response.data.comments);
        setLikeCount(response.data.likeCount);
        setLiked(response.data.liked); // Assuming API response includes if current user liked the post
        setEditedTitle(response.data.title);
        setEditedContent(response.data.content);
      } catch (error) {
        setError('Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleBack = () => {
    navigate('/notices');
  };

  const handleEdit = () => {
    if (isEditing) {
      api.put(`/notices/${id}`, { title: editedTitle, content: editedContent })
        .then(() => {
          setPost((prev) => ({ ...prev, title: editedTitle, content: editedContent }));
          setIsEditing(false);
        })
        .catch((error) => {
          setError('Error updating title and content');
        });
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.put(`/notices/${id}/is-active`, { isActive: false });
        navigate('/notices');
      } catch (error) {
        setError('Error deleting post');
      }
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/notices/${id}/likes`);
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      } else {
        await api.post(`/notices/${id}/likes`);
        setLikeCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking/unliking post', error);
      setError('Error liking/unliking post');
    }
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="notice-detail">
      <div className="notice-detail-header">
        <button type="button" className="back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="post-actions">
          {currentUser && currentUser.id === post.userId && (
            <>
              <button type="button" className="edit-button" onClick={handleEdit}>
                <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
              </button>
              <button type="button" className="delete-button" onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <div>
          <input
            type="text"
            className="edit-title-input"
            value={editedTitle}
            onChange={handleTitleChange}
          />
          <textarea
            className="edit-content-textarea"
            value={editedContent}
            onChange={handleContentChange}
          />
        </div>
      ) : (
        <>
          <h2 className="post-title">{post.title}</h2>
          <div className="post-content">{post.content}</div>
        </>
      )}
      <div className="post-meta">
        <span className="post-author">{post.userName}</span> · <span className="post-date">{post.createdDate}</span>
      </div>
      <div className="post-actions">
        <span className="post-likes" onClick={handleLike}>
          <FontAwesomeIcon icon={faHeart} color={liked ? 'red' : 'gray'} /> {likeCount}
        </span>
        <span className="post-comments">💬 {comments.length}</span>
      </div>
      <CommentList postId={id} comments={comments} setComments={setComments} />
    </div>
  );
};

export default NoticeDetail;
