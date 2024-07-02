import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/Notice.css';
import { UserContext } from '../contexts/UserContext';

const Notice = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [kind, setKind] = useState(null);
  const [noticeTypes, setNoticeTypes] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);

  const fetchNoticeTypes = useCallback(async () => {
    try {
      const response = await api.get('/notice-type');
      if (response.data) {
        setNoticeTypes(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching notice types:', error);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const params = {
        page: page,
        perPage: 5,
        status: true,
      };

      if (kind !== null) params.kind = kind;

      const response = await api.get('/notices', { params });

      if (response.data && Array.isArray(response.data.content)) {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [page, kind]);

  useEffect(() => {
    fetchNoticeTypes();
  }, [fetchNoticeTypes]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  const handleKindChange = (newKind) => {
    setKind(newKind);
    setPage(0);
  };

  const truncateContent = (content) => {
    return content.length > 20 ? content.substring(0, 20) + '... 더보기' : content;
  };

  const getKindLabel = (kind) => {
    const kindObj = noticeTypes.find(type => type.id === kind);
    return kindObj ? `[${kindObj.type}] ` : '';
  };

  const handlePostClick = (id) => {
    navigate(`/notices/${id}`);
  };

  return (
    <div className="notice-page">
      <div className="tab-buttons-container">
        <div className="tab-buttons">
          <button className={`tab-button ${kind === null ? 'active' : ''}`} onClick={() => handleKindChange(null)}>전체</button>
          {noticeTypes.map((type) => (
            <button key={type.id} className={`tab-button ${kind === type.id ? 'active' : ''}`} onClick={() => handleKindChange(type.id)}>{type.type}</button>
          ))}
        </div>
      </div>
      <div className="posts-container">
        <div className="posts">
          {posts.map((post, index) => (
            <div key={index} className="post" onClick={() => handlePostClick(post.id)}>
              <h2 className="post-title">{getKindLabel(post.kind)}{post.title}</h2>
              <p className="post-content">{truncateContent(post.content)}</p>
              <div className="post-footer">
                <span className="post-author">[{currentUser.branchName}] {post.userName}</span> · <span className="post-date">{post.createdDate}</span>
                <div className="post-actions">
                  <span className="post-likes">❤ {post.likeCount}</span>
                  <span className="post-comments">💬 {post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination-buttons">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => handlePageClick(i)} disabled={page === i}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Notice;
