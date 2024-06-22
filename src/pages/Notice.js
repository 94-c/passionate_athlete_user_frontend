import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import '../styles/Notice.css';

const Notice = () => {
  const [posts, setPosts] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchName, setSearchName] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [kind, setKind] = useState(null);
  const [searchType, setSearchType] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const params = {
        page: page,
        perPage: 5,
        status: true,
      };

      if (searchType === 'title') params.title = searchTitle;
      if (searchType === 'name') params.name = searchName;
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
  }, [page, kind, searchTitle, searchName, searchType]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPosts();
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  const handleKindChange = (newKind) => {
    setKind(newKind);
    setPage(0);
  };

  return (
    <div className="notice-page">
      <div className="filter-buttons">
        <div className="filter-button-container">
          <button className={`filter-button ${kind === null ? 'active' : ''}`} onClick={() => handleKindChange(null)}>전체</button>
          <button className={`filter-button ${kind === 0 ? 'active' : ''}`} onClick={() => handleKindChange(0)}>종류 1</button>
          <button className={`filter-button ${kind === 1 ? 'active' : ''}`} onClick={() => handleKindChange(1)}>종류 2</button>
          <button className={`filter-button ${kind === 2 ? 'active' : ''}`} onClick={() => handleKindChange(2)}>종류 3</button>
          <button className={`filter-button ${kind === 3 ? 'active' : ''}`} onClick={() => handleKindChange(3)}>종류 4</button>
        </div>
        {!showSearch ? (
          <button className="search-button" onClick={() => setShowSearch(true)}>🔍</button>
        ) : (
          <form className="search-form" onSubmit={handleSearch}>
            <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
              <option value="">선택하세요</option>
              <option value="title">제목</option>
              <option value="name">이름</option>
            </select>
            <input
              type="text"
              placeholder={searchType === 'title' ? '제목 검색' : '이름 검색'}
              value={searchType === 'title' ? searchTitle : searchName}
              onChange={(e) => {
                if (searchType === 'title') {
                  setSearchTitle(e.target.value);
                } else if (searchType === 'name') {
                  setSearchName(e.target.value);
                }
              }}
            />
            <button type="submit">Search</button>
          </form>
        )}
      </div>
      <div className="posts-container">
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
      </div>
      <div className="pagination-buttons">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => handlePageClick(i)} disabled={page === i}>
            {i + 1}
          </button>
        ))}
      </div>
      <button className="add-post-button">✏️</button>
    </div>
  );
};

export default Notice;
