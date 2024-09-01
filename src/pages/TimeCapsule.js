import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/TimeCapsule.css';
import { UserContext } from '../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentDots } from '@fortawesome/free-solid-svg-icons';

const TimeCapsule = () => {
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const { user: currentUser } = useContext(UserContext);

    const fetchRecords = async () => {
        try {
            const response = await api.get('/workout-record-notice', {
                params: {
                    page: page,
                    perPage: 5, // Adjust perPage as needed
                },
            });
            if (response.data && response.data.content) {
                setRecords(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching workout records:', error);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [page]);

    const handlePostClick = (id) => {
        navigate(`/timecapsule/${id}`);
    };

    // Handle pagination clicks
    const handlePageClick = (pageNum) => {
        setPage(pageNum);
    };

    return (
        <div className="time-capsule-container">
            <div className="capsule-posts-container">
                <div className="capsule-posts">
                    {records.map((record, index) => (
                        <div key={index} className="capsule-post" onClick={() => handlePostClick(record.id)}>
                            <div className="post-header">
                                <div className="post-user-info">
                                    <span className="username">[{record.branchName}] {record.userName}</span>
                                    <span className="post-time">{record.createdDate}</span>
                                </div>
                            </div>
                            <div className="post-tags">
                                {record.tags && record.tags.map((tag, i) => (
                                    <span key={i} className="tag">{tag}</span>
                                ))}
                            </div>
                            <div className="capsule-post-footer">
                                <div className="capsule-post-actions">
                                    <span className="capsule-post-likes">
                                        <FontAwesomeIcon icon={faHeart} /> {record.likeCount || 0}
                                    </span>
                                    <span className="capsule-post-comments">
                                        <FontAwesomeIcon icon={faCommentDots} /> {record.commentCount || 0}
                                    </span>
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
