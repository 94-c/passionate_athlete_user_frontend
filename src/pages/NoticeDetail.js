import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faSave, faHeart } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { api } from '../api/Api';
import { UserContext } from '../contexts/UserContext';
import CommentList from './CommentList';
import Loading from '../components/Loading';
import '../styles/NoticeDetail.css';

const QuillWrapper = (props) => {
  const ref = useRef(null);
  return <ReactQuill ref={ref} {...props} />;
};

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedKindId, setEditedKindId] = useState('');
  const [noticeTypes, setNoticeTypes] = useState([]);
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/notices/${id}`);
        if (response.data) {
          setPost(response.data);
          setComments(response.data.comments || []); // Fallback to empty array
          setLikeCount(response.data.likeCount);
          setLiked(response.data.liked);
          setEditedTitle(response.data.title);
          setEditedContent(response.data.content);
          setEditedKindId(response.data.kindId);
        }
      } catch (error) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const fetchNoticeTypes = async () => {
      try {
        const response = await api.get('/notice-type');
        if (response.data) {
          setNoticeTypes(response.data);
        }
      } catch (error) {
        console.error('게시글 타입을 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPost();
    fetchNoticeTypes();
  }, [id]);

  const handleBack = () => {
    navigate('/notices');
  };

  const handleEdit = async () => {
    if (isEditing) {
      if (!editedTitle.trim()) {
        alert('제목을 입력하세요.');
        return;
      }

      if (!editedContent.trim()) {
        alert('내용을 입력하세요.');
        return;
      }

      const notice = {
        title: editedTitle,
        content: editedContent,
        kindId: editedKindId,
      };

      try {
        await api.put(`/notices/${id}`, notice);
        setPost((prev) => ({ ...prev, title: editedTitle, content: editedContent, kindId: editedKindId }));
        setIsEditing(false);
      } catch (error) {
        setError('게시글 수정에 실패했습니다.');
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await api.delete(`/notices/${id}`);
        alert('게시글이 성공적으로 삭제되었습니다.');
        navigate('/notices');
      } catch (error) {
        setError('게시글 삭제 중 오류가 발생했습니다.');
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
      console.error('좋아요 처리 중 오류가 발생했습니다.', error);
      setError('좋아요 상태를 업데이트하는 데 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleContentChange = (value) => {
    setEditedContent(value);
  };

  const handleKindChange = (e) => {
    setEditedKindId(e.target.value);
  };

  if (loading) return <Loading />;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="notice-detail">
      <div className="notice-detail-header">
        <button type="button" className="back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="post-actions">
          {currentUser && currentUser.id === post?.userId && (
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
          <select value={editedKindId} onChange={handleKindChange} className="edit-kind-select">
            <option value="" disabled>게시판 종류 선택</option>
            {noticeTypes.map(type => (
              <option key={type.id} value={type.id}>{type.type}</option>
            ))}
          </select>
          <input
            type="text"
            className="edit-title-input"
            value={editedTitle}
            onChange={handleTitleChange}
          />
          <div className="edit-content">
            <QuillWrapper
              ref={quillRef}
              value={editedContent}
              onChange={handleContentChange}
              modules={{
                toolbar: {
                  container: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                  ],
                },
              }}
              formats={[
                'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'align', 'link', 'image'
              ]}
              placeholder="내용을 입력하세요."
              className="text-editor"
              style={{ height: '50vh', marginBottom: '20px' }}
            />
          </div>
        </div>
      ) : (
        <>
          <h3 className="post-kind">[{post?.kind}]</h3>
          <h2 className="post-title">{post?.title}</h2>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />
          <div className="post-meta">
            <span className="post-author">[{currentUser.branchName}] {post?.userName}</span> · <span className="post-date">{post?.createdDate}</span>
          </div>
          <div className="post-actions">
            <span className="post-likes" onClick={handleLike}>
              <FontAwesomeIcon icon={faHeart} color={liked ? 'red' : 'gray'} /> {likeCount}
            </span>
            <span className="post-comments">💬 {comments.length}</span>
          </div>
          <CommentList postId={id} comments={comments} setComments={setComments} currentUser={currentUser} />
        </>
      )}
    </div>
  );
};

export default NoticeDetail;
