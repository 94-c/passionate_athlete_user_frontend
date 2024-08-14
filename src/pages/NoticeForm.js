import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCamera, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postData, getData } from '../api/Api.js';
import '../styles/NoticeForm.css';
import { UserContext } from '../contexts/UserContext';

const NoticeForm = () => {
  const [kindId, setKindId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [previewImgUrls, setPreviewImgUrls] = useState([]);
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

  const handleKindChange = (event) => {
    setKindId(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleFileChange = (event) => {
    const selectedFiles = [...event.target.files];
    setFiles([...files, ...selectedFiles]);

    const fileReaders = selectedFiles.map(file => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      return fileReader;
    });

    Promise.all(fileReaders.map(fr => {
      return new Promise(resolve => {
        fr.onload = () => {
          resolve(fr.result);
        };
      });
    })).then(imgUrls => {
      setPreviewImgUrls([...previewImgUrls, ...imgUrls]);

      // 텍스트 에디터에 이미지 URL 삽입
      const quill = quillRef.current.getEditor();
      imgUrls.forEach(url => {
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
        quill.setSelection(range.index + 1);
      });
    });
  };

  const handleDeleteImg = (index) => {
    const newFiles = [...files];
    const newPreviewImgUrls = [...previewImgUrls];
    newFiles.splice(index, 1);
    newPreviewImgUrls.splice(index, 1);
    setFiles(newFiles);
    setPreviewImgUrls(newPreviewImgUrls);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const notice = {
      kindId: kindId,
      title: title,
      content: content,
      status: true  // isStatus 값을 true로 설정
    };

    try {
      const formData = new FormData();
      formData.append('noticeJson', new Blob([JSON.stringify(notice)], { type: 'application/json' }));
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
          <select className="board-select" value={kindId} onChange={handleKindChange}>
            <option value="" disabled>게시판 종류 선택</option>
            {noticeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </select>
          <input type="text" className="post-form-title" placeholder="제목" value={title} onChange={handleTitleChange} />
          <ReactQuill
            ref={quillRef}
            value={content}
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
            style={{ height: '50vh', marginBottom: '20px' }}  // 에디터 높이 조정
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
      </form>
    </div>
  );
};

export default NoticeForm;