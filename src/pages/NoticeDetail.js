import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faSave, faTrashAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { api } from '../api/Api';
import { UserContext } from '../contexts/UserContext';
import CommentList from './CommentList'; // Make sure CommentList is imported
import '../styles/NoticeDetail.css';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [files, setFiles] = useState([]);
  const [previewImgUrls, setPreviewImgUrls] = useState([]);
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/notices/${id}`);
        setPost(response.data);
        setComments(response.data.comments);
        setLikeCount(response.data.likeCount);
        setLiked(response.data.liked);
        setEditedTitle(response.data.title);
        setEditedContent(response.data.content);
      } catch (error) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleBack = () => {
    navigate('/notices');
  };

  const handleEdit = async () => {
    if (isEditing) {
      const notice = {
        title: editedTitle,
        content: editedContent,
      };

      try {
        const formData = new FormData();
        formData.append('noticeJson', new Blob([JSON.stringify(notice)], { type: 'application/json' }));
        files.forEach((file) => {
          formData.append('files', file);
        });

        await api.put(`/notices/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setPost((prev) => ({ ...prev, title: editedTitle, content: editedContent }));
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
        await api.post(`/notices/delete/${id}`); // 삭제 요청을 POST 메소드로 변경
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
      if (error.response && error.response.data && error.response.data.message === '이미 좋아요를 누르셨습니다.') {
        alert('이미 좋아요를 누르셨습니다.');
      } else {
        setError('좋아요 상태를 업데이트하는 데 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleContentChange = (value) => {
    setEditedContent(value);
  };

  const handleFileChange = async (event) => {
    const selectedFiles = [...event.target.files];
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    const fileReaders = selectedFiles.map(file => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      return fileReader;
    });

    const imgUrls = await Promise.all(fileReaders.map(fr => {
      return new Promise(resolve => {
        fr.onload = () => {
          resolve(fr.result);
        };
      });
    }));

    setPreviewImgUrls([...previewImgUrls, ...imgUrls]);

    for (let file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await api.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const fileUrl = response.data.filePath;

        // 텍스트 에디터에 이미지 URL 삽입
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', fileUrl);
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error('파일 업로드 중 오류가 발생했습니다:', error);
      }
    }
  };

  const handleDeleteImg = (index) => {
    const newFiles = [...files];
    const newPreviewImgUrls = [...previewImgUrls];
    newFiles.splice(index, 1);
    newPreviewImgUrls.splice(index, 1);
    setFiles(newFiles);
    setPreviewImgUrls(newPreviewImgUrls);
  };

  if (loading) return <div>로딩 중...</div>;
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
          <ReactQuill
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
              }
            }}
            formats={[
              'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'align', 'link', 'image'
            ]}
            placeholder="내용을 입력하세요."
            style={{ height: '50vh', marginBottom: '20px' }}
          />
          <input type="file" className="file-input" style={{ display: 'none' }} onChange={handleFileChange} multiple />
          {previewImgUrls.length > 0 && (
            <div className="preview-img-wrap">
              {previewImgUrls.map((imgUrl, index) => (
                <div key={index} className="preview-img-container">
                  <img src={imgUrl} alt="이미지 미리보기" className="preview-img" />
                  <button type="button" className="delete-img-button" onClick={() => handleDeleteImg(index)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <h2 className="post-title">{post.title}</h2>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ maxWidth: '100%', overflowX: 'auto' }}
          />
          <div className="post-meta">
            <span className="post-author">[{currentUser.branchName}] {post.userName}</span> · <span className="post-date">{post.createdDate}</span>
          </div>
          <div className="post-actions">
            <span className="post-likes" onClick={handleLike}>
              <FontAwesomeIcon icon={faHeart} color={liked ? 'red' : 'gray'} /> {likeCount}
            </span>
            <span className="post-comments">💬 {comments.length}</span>
          </div>
          {!isEditing && (
            <CommentList postId={id} comments={comments} setComments={setComments} currentUser={currentUser} />
          )}
        </>
      )}
    </div>
  );
};

export default NoticeDetail;
