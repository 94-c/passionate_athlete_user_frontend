import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import '../styles/Notice.css';

const Notice = () => {
  const [posts, setPosts] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchName, setSearchName] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const params = {
        page: 0,
        perPage: 10,
        kind: 1,
        status: true,
      };

      if (searchTitle) params.title = searchTitle;
      if (searchName) params.name = searchName;

      const response = await api.get('/notices', { params });

      // 콘솔 로그 추가
      console.log('API Response:', response.data);

      // API 응답 데이터 형식 확인
      if (response.data && Array.isArray(response.data.content)) {
        setPosts(response.data.content);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [searchTitle, searchName]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="notice-page">
      <div className="filter-buttons">
        <button className="filter-button active">전체</button>
        {showSearch ? (
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        ) : (
          <button className="search-button" onClick={() => setShowSearch(true)}>🔍</button>
        )}
      </div>
      <div className="posts">
        {posts.map((post, index) => (
          <div key={index} className="post">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <div className="post-footer">
              <span className="post-author">{post.userName}</span> · <span className="post-date">{post.createdDate}</span>
              <div className="post-actions">
                <span className="post-likes">❤ {post.likeCount}</span>
                <span className="post-comments">💬 {post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="add-post-button">✏️</button>
    </div>
  );
};

export default Notice;
