import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/Api.js';
import { UserContext } from '../contexts/UserContext';
import '../styles/Search.css';

const Search = () => {
  const [searchType, setSearchType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);

  const handleSearch = async (e) => {
    e.preventDefault();

    const params = {
      status: true,
      page: page,
      perPage: 5,
    };

    if (searchType === 'title') {
      params.title = searchQuery;
    } else if (searchType === 'name') {
      params.name = searchQuery;
    }

    try {
      const response = await api.get('/notices/search', { params });
      if (response.data && Array.isArray(response.data.content)) {
        setResults(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const truncateContent = (content) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = content;
    const textContent = tempElement.textContent || tempElement.innerText || "";
    return textContent.length > 20 ? textContent.substring(0, 20) + '... 더보기' : textContent;
  };


  const handlePageClick = (pageNum) => {
    setPage(pageNum);
    handleSearch({ preventDefault: () => { } });
  };

  const handleResultClick = (id) => {
    navigate(`/notices/${id}`);
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
            <option value="">선택하세요</option>
            <option value="title">제목</option>
            <option value="name">이름</option>
          </select>
          <input
            type="text"
            placeholder={searchType === 'title' ? '제목 검색' : '이름 검색'} // 수정
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">검색</button>
        </form>
      </div>
      <div className="search-results-container">
        <div className="search-results">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="result" onClick={() => handleResultClick(result.id)}>
                <h2 className="result-title">{result.title}</h2>
                <p className="result-content">{truncateContent(result.content)}</p>
                <div className="result-footer">
                  <span className="result-author">[{currentUser.branchName}] {result.userName}</span> · <span className="result-date">{result.createdDate}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">검색 결과가 없습니다.</p>
          )}
        </div>
        <div className="pagination-buttons">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => handlePageClick(i)} disabled={page === i}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
