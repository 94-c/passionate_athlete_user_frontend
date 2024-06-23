// NoticeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/Api';
//import '../styles/NoticeDetail.css';

const NoticeDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/notices/${id}`);
        setPost(response.data);
      } catch (error) {
        setError('Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="notice-detail">
      <h2 className="post-title">{post.title}</h2>
      <div className="post-meta">
        <span className="post-author">{post.userName}</span> · <span className="post-date">{post.createdDate}</span>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <span className="post-likes">❤ {post.likeCount}</span>
        <span className="post-comments">💬 {post.comments.length}</span>
      </div>
    </div>
  );
};

export default NoticeDetail;
