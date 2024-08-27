import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/TimeCapsule.css'; // Ensure you create a corresponding CSS file for styling
import { UserContext } from '../contexts/UserContext';

const TimeCapsule = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState(0); // Default to 0 to show all capsules
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { user: currentUser } = useContext(UserContext);
    const tabContainerRef = useRef(null); // Ref for the tab container

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.get('/time-capsule-category'); // Adjusted API endpoint
            if (response.data) {
                setCategories(response.data);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    const fetchPosts = useCallback(async () => {
        try {
            const params = {
                page: page,
                perPage: 5,
                status: true,
                categoryId: category !== 0 ? category : null,
            };
            const response = await api.get('/time-capsules', { params }); // Adjusted API endpoint

            if (response.data && response.data.content) {
                setPosts(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [page, category]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, category]);

    const handlePageClick = (pageNum) => {
        setPage(pageNum);
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setPage(0);
    };

    const truncateContent = (content) => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = content;
        const textContent = tempElement.textContent || tempElement.innerText || "";
        return textContent.length > 20 ? textContent.substring(0, 20) + '... 더보기' : textContent;
    };

    const getCategoryLabel = (category) => {
        const categoryObj = categories.find(type => type.id === category);
        return categoryObj ? `[${categoryObj.type}] ` : '';
    };

    const handlePostClick = (id) => {
        navigate(`/time-capsules/${id}`); // Adjusted navigation path
    };

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
        <div className="time-capsule-container">
            <div className="capsule-tab-container" ref={tabContainerRef}>
                <div className="capsule-tabs">
                    <button className={`capsule-tab ${category === 0 ? 'active' : ''}`} onClick={() => handleCategoryChange(0)}>전체</button>
                    {categories.map((type) => (
                        <button key={type.id} className={`capsule-tab ${category === type.id ? 'active' : ''}`} onClick={() => handleCategoryChange(type.id)}>{type.type}</button>
                    ))}
                </div>
            </div>
            <div className="capsule-posts-container">
                <div className="capsule-posts">
                    {posts.map((post, index) => (
                        <div key={index} className="capsule-post" onClick={() => handlePostClick(post.id)}>
                            <h2 className="capsule-post-title">[{getCategoryLabel(post.categoryId)}] {post.title}</h2>
                            <p className="capsule-post-content">{truncateContent(post.content)}</p>
                            <div className="capsule-post-footer">
                                <span className="capsule-post-author">[{currentUser.branchName}] {post.userName}</span> · <span className="capsule-post-date">{post.createdDate}</span>
                                <div className="capsule-post-actions">
                                    <span className="capsule-post-likes">❤ {post.likeCount}</span>
                                    <span className="capsule-post-comments">💬 {post.commentCount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="capsule-pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => handlePageClick(i)} disabled={page === i}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TimeCapsule;
