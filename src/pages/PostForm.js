import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCamera } from '@fortawesome/free-solid-svg-icons';
import api from '../api/api';
import '../styles/PostForm.css';

const PostForm = () => {
  const [kind, setKind] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || sessionStorage.getItem('userRoles') || '[]');
    setRoles(userRoles);
  }, []);

  const handleKindChange = (event) => {
    setKind(Number(event.target.value));
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const notice = {
      kind: kind,
      title: title,
      content: content,
    };

    const formData = new FormData();
    formData.append('notice', JSON.stringify(notice));
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await api.post('/notices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('공지사항이 성공적으로 등록되었습니다.');
        navigate('/notices');
      } else {
        alert('공지사항 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('공지사항 등록 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    navigate('/notices');
  };

  return (
    <div className="post-form-page">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="post-form-header">
          <button type="button" className="close-button" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="header-title">
            <span className="draft">임시저장</span>
            <button type="submit" className="submit-button">
              등록
            </button>
          </div>
        </div>
        <div className="post-form-content">
          <select className="board-select" value={kind} onChange={handleKindChange}>
            {(roles.includes('admin') || roles.includes('manage') || roles.includes('MANAGER')) && (
              <option value={0}>공지</option>
            )}
            <option value={1}>멱살</option>
            <option value={2}>자랑</option>
          </select>
          <input type="text" className="post-form-title" placeholder="제목" value={title} onChange={handleTitleChange} />
          <textarea className="post-content" placeholder="내용을 입력하세요." value={content} onChange={handleContentChange} />
          <input type="file" className="file-input" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
        <div className="post-form-footer">
          <button type="button" className="footer-icon" onClick={() => document.querySelector('.file-input').click()}>
            <FontAwesomeIcon icon={faCamera} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
