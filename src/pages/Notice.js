import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/Notice.css';
import { UserContext } from '../contexts/UserContext';

const Notice = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [kind, setKind] = useState(0); // Default to 0 to show all notices
  const [noticeTypes, setNoticeTypes] = useState([]);
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const tabContainerRef = useRef(null); // Ref for the tab container

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
        kindId: kind !== null ? kind : 0, // Set kindId to 0 if it's null
      };

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
  }, [fetchPosts, kind]); // 추가: kind 상태가 변경될 때마다 fetchPosts 호출

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

  // Scroll handling logic
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const tabContainer = tabContainerRef.current;

    const mouseDownHandler = (e) => {
      isDragging.current = true;
      startX.current = e.pageX - tabContainer.offsetLeft;
      scrollLeft.current = tabContainer.scrollLeft;
    };

    const mouseLeaveOrUpHandler = () => {
      isDragging.current = false;
    };

    const mouseMoveHandler = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - tabContainer.offsetLeft;
      const walk = (x - startX.current) * 2; // Scroll speed
      tabContainer.scrollLeft = scrollLeft.current - walk;
    };

    // Add mouse event listeners
    tabContainer.addEventListener('mousedown', mouseDownHandler);
    tabContainer.addEventListener('mouseleave', mouseLeaveOrUpHandler);
    tabContainer.addEventListener('mouseup', mouseLeaveOrUpHandler);
    tabContainer.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      // Cleanup event listeners
      tabContainer.removeEventListener('mousedown', mouseDownHandler);
      tabContainer.removeEventListener('mouseleave', mouseLeaveOrUpHandler);
      tabContainer.removeEventListener('mouseup', mouseLeaveOrUpHandler);
      tabContainer.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  return (
    <div className="notice-page">
      <div className="tab-buttons-container" ref={tabContainerRef}>
        <div className="tab-buttons">
          <button className={`tab-button ${kind === 0 ? 'active' : ''}`} onClick={() => handleKindChange(0)}>전체</button>
          {noticeTypes.map((type) => (
            <button key={type.id} className={`tab-button ${kind === type.id ? 'active' : ''}`} onClick={() => handleKindChange(type.id)}>{type.type}</button>
          ))}
        </div>
      </div>
      <div className="posts-container">
        <div className="posts">
          {posts.map((post, index) => (
            <div key={index} className="post" onClick={() => handlePostClick(post.id)}>
              <h2 className="post-title">[{post.kind}] {post.title}</h2>
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
