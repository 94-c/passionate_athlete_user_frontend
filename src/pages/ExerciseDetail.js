import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import '../styles/ExerciseDetail.css';
import ReactQuill from 'react-quill';
import Loading from '../components/Loading';

const QuillWrapper = (props) => {
  const ref = useRef(null);
  return <ReactQuill ref={ref} {...props} />;
};

const ExerciseDetail = () => {
  const { id } = useParams(); // URL에서 ID 가져오기
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/workout-record-histories/${id}`);
        setRecord(response.data);
      } catch (error) {
        console.error('Failed to fetch workout record:', error);
        setError('운동 기록을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });
  };

  const handleEditorChange = (content) => {
    setRecord({ ...record, recordContent: content });
  };

  const handleDeleteHistory = async (historyId) => {
    try {
      await api.delete(`/workout-record-histories/${historyId}`);
      setRecord({
        ...record,
        histories: record.histories.filter((history) => history.id !== historyId),
      });
    } catch (error) {
      console.error('Error deleting workout history:', error);
      alert('운동 히스토리 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/workout-records/${id}`, record);
      alert('운동 기록이 업데이트되었습니다.');
      navigate('/exercise'); // 수정 후 목록 페이지로 이동
    } catch (error) {
      console.error('Error updating workout record:', error);
      setError('운동 기록 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatRecordValue = (value) => {
    return value === null || value === '' ? '-' : value;
  };

  const formatExerciseType = (type) => {
    switch (type) {
      case 'MODIFIED':
        return '[변형] 변형 운동';
      case 'ADDITIONAL':
        return '[추가] 추가 운동';
      default:
        return '[본운동]';
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="error-message">{error}</p>;
  if (!record) return null;

  return (
    <div className="exercise-detail-page">
      <div className="exercise-modified-header">
        <h1 className="exercise-modified-title">운동 기록 수정 🏋️‍♂️</h1>
      </div>
      <form onSubmit={handleSubmit} className="exercise-modified-form">
        <div className="basic-info-section exercise-modified-info">
          <h2>기본 정보</h2>
          <div className="basic-info-grid">
            <input
              type="number"
              name="rounds"
              placeholder="라운드 수"
              value={record.rounds || ''}
              onChange={handleChange}
              min="1"
              className="custom-input"
            />
            <input
              type="text"
              name="duration"
              placeholder="시간"
              value={record.duration || ''}
              onChange={handleChange}
              maxLength="5"
              className="custom-input"
            />
            <select
              name="rating"
              value={record.rating || ''}
              onChange={handleChange}
              className="custom-input"
            >
              <option value="">등급 선택</option>
              <option value="SS+">SS+</option>
              <option value="SS">SS</option>
              <option value="S+">S+</option>
              <option value="S">S</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
            </select>
            <select
              name="success"
              value={record.success ? 'true' : 'false'}
              onChange={(e) =>
                handleChange({
                  target: { name: 'success', value: e.target.value === 'true' },
                })
              }
              className="custom-input"
            >
              <option value="true">성공</option>
              <option value="false">실패</option>
            </select>
          </div>
        </div>

        <div className="record-content-container">
          <div className="custom-quill-container">
            <QuillWrapper
              value={record.recordContent || ''}
              onChange={handleEditorChange}
              modules={{
                toolbar: [
                  [{ header: '1' }, { header: '2' }, { font: [] }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ align: [] }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              formats={[
                'header',
                'font',
                'list',
                'bullet',
                'bold',
                'italic',
                'underline',
                'strike',
                'blockquote',
                'align',
                'link',
                'image',
              ]}
              placeholder="기록 내용을 입력하세요."
            />
          </div>
        </div>

        <button type="submit" className="exercise-modified-submit-button">
          수정 완료
        </button>
      </form>

      {/* 운동 기록 히스토리 섹션 */}
      <div className="exercise-history-section exercise-modified-info">
        <h2>운동 기록 히스토리</h2>
        <div className="exercise-modal-history">
          {record.histories && record.histories.length > 0 ? (
            record.histories.map((history, index) => (
              <div key={index} className="exercise-modal-history-item">
                <h4 className="exercise-name">{history.exerciseName}</h4>
                <div className="exercise-details">
                  <span>{formatRecordValue(history.rating)}</span>
                  <span>{formatRecordValue(history.weight)} kg</span>
                  <span>{formatRecordValue(history.repetitions)} 라운드</span>
                  <button
                    className="remove-exercise-button"
                    onClick={() => handleDeleteHistory(history.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="exercise-modal-history-item">
              <h4 className="exercise-name">운동 기록 없음</h4>
              <div className="exercise-details">
                <span>-</span>
                <span>-</span>
                <span>-</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
