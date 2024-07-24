import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import './MagazineTop.css';

const chipData = [
  { label: '이달의 POP-UP', path: '/board/freeboard' },
  { label: '술 TMI', path: '/board/shortform' },
  { label: '섞어섞어 Recipe', path: '/board/eventboard' },
  { label: '이주의 술집추천', path: '/board/eventboard' },
];

function MagazineTop() {
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
        return '이달의 POP-UP';
      case '/board/shortform':
        return '술 TMI';
      case '/board/eventboard':
        return '섞어섞어 Recipe';
      case '/board/eventboard':
        return '이주의 술집추천';
      default:
        return 'Chee Us 메거진';
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
            className="chip-name"
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

export default MagazineTop;
