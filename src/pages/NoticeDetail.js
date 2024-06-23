import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/NoticeDetail.css';

const NoticeDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/notices/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="notice-detail-page">
      <h1 className="notice-detail-title">{post.title}</h1>
      <div className="notice-detail-meta">
        <span className="notice-detail-author">{post.userName}</span> · <span className="notice-detail-date">{post.createdDate}</span>
      </div>
      <div className="notice-detail-content">{post.content}</div>
      <div className="notice-detail-footer">
        <span className="notice-detail-likes">❤ {post.likeCount}</span>
        <span className="notice-detail-comments">💬 {post.comments.length}</span>
      </div>
    </div>
  );
};

export default NoticeDetail;
