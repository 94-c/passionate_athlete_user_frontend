import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postData, getData } from '../api/Api.js';
import '../styles/NoticeForm.css';
import { UserContext } from '../contexts/UserContext';

// QuillWrapper component
const QuillWrapper = (props) => {
  const ref = useRef(null);
  return <ReactQuill ref={ref} {...props} />;
};

const NoticeForm = () => {
  const [kindId, setKindId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noticeTypes, setNoticeTypes] = useState([]);
  const { user: currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const quillRef = useRef(null);

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

  const handleKindChange = (event) => setKindId(event.target.value);
  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleContentChange = (value) => setContent(value);

  const handleClose = () => navigate('/notices');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation check
    if (!title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력하세요.');
      return;
    }

    const notice = {
      kindId,
      title,
      content,
      status: true
    };

    try {
      const formData = new FormData();
      formData.append('noticeJson', new Blob([JSON.stringify(notice)], { type: 'application/json' }));
      await postData('/notices', formData, true);
      alert('게시글이 성공적으로 등록되었습니다.');
      navigate('/notices');
    } catch (error) {
      console.error('Error:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    }
  };

  const handleImageInserted = () => {
    const editor = quillRef.current.getEditor();
    const images = editor.container.querySelectorAll('img');
    images.forEach((img) => {
      img.style.width = '33%';
      img.style.height = 'auto';
    });
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
            <button type="submit" className="submit-button">등록</button>
          </div>
        </div>
        <div className="post-form-content">
          <select className="board-select" value={kindId} onChange={handleKindChange}>
            <option value="" disabled>게시판 종류 선택</option>
            {noticeTypes.map(type => (
              <option key={type.id} value={type.id}>{type.type}</option>
            ))}
          </select>
          <input 
            type="text" 
            className="post-form-title" 
            placeholder="제목" 
            value={title} 
            onChange={handleTitleChange} 
          />
          <div className="record-content">
            <QuillWrapper
              ref={quillRef}
              value={content}
              onChange={handleContentChange}
              onBlur={handleImageInserted} // Handle image size after insert
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
              className="text-editor"
              placeholder="내용을 입력하세요."
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NoticeForm;
