import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import './boardTop.css';

const chipData = [
  { label: '자유 게시판', path: '/board/freeboard' },
  { label: '숏폼 게시판', path: '/board/shortform' },
  { label: '이벤트 게시판', path: '/board/eventboard' }
];

function BoardTop() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // URL 쿼리에서 검색어를 읽어와 상태에 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  // 검색어 변경 시 URL 업데이트
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    navigate(`${location.pathname}?search=${query}`);
  };

  const getBoardTitle = () => {
    switch (location.pathname) {
      case '/board/freeboard':
        return '자유 게시판';
      case '/board/shortform':
        return '숏폼 게시판';
      case '/board/eventboard':
        return '이벤트 게시판';
      default:
        return '게시판';
    }
  };

  const shouldShowSearch = () => {
    return ['/board/freeboard', '/board/shortform', '/board/eventboard'].includes(location.pathname);
  };

  return (
    <div>
      <div className="board-page-top">
        {getBoardTitle()}
        {shouldShowSearch() && (
          <div className="board-top">
            <input
              type="text"
              className="board-search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange} // 입력 시 검색어 업데이트 및 URL 변경
            />
            <Search className="search-icon" />
          </div>
        )}
      </div>
      <div className="category-container">
        {chipData.map((data, index) => (
          <button
            className="chip-name btn btn-outline-dark"
            key={index}
            onClick={() => navigate(data.path)}
          >
            {data.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BoardTop;
