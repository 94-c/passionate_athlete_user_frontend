import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCamera } from '@fortawesome/free-solid-svg-icons';
import { postData, getData } from '../api/Api.js';
import '../styles/NoticeForm.css';
import { UserContext } from '../contexts/UserContext';

const NoticeForm = () => {
  const [kind, setKind] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [noticeTypes, setNoticeTypes] = useState([]);
  const { user: currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNoticeTypes = async () => {
      try {
        let response;
        if (currentUser && (currentUser.roles.includes('ADMIN') || currentUser.roles.includes('MANAGER'))) {
          response = await getData('/notice-type');
        } else if (currentUser) {
          response = await getData(`/notice-type/roles?role=user`);
        }
        if (response) {
          setNoticeTypes(response.data);
        }
      } catch (error) {
        console.error('Error fetching notice types:', error);
      }
    };

    if (currentUser) {
      fetchNoticeTypes();
    }
  }, [currentUser]);

  const handleKindChange = (event) => {
    setKind(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  const notice = {
    kindId: kind,
    title: title,
    content: content,
  };

  try {
    const formData = new FormData();
    formData.append('notice', new Blob([JSON.stringify(notice)], { type: 'application/json' }));

    files.forEach((file) => {
      formData.append('files', file);
    });

    await postData('/notices', formData, true);

    alert('게시글이 성공적으로 등록되었습니다.');
    navigate('/notices');
  } catch (error) {
    console.error('Error:', error);
    alert('게시글 등록 중 오류가 발생했습니다.');
  }
};

  const handleClose = () => {
    navigate('/notices');
  };

  return (
    <div className="post-form-page">
      <form onSubmit={handleSubmit}>
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
            {noticeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </select>
          <input type="text" className="post-form-title" placeholder="제목" value={title} onChange={handleTitleChange} />
          <textarea className="post-form-textarea" placeholder="내용을 입력하세요." value={content} onChange={handleContentChange} />
          <input type="file" className="file-input" style={{ display: 'none' }} onChange={handleFileChange} multiple />
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

export default NoticeForm;
