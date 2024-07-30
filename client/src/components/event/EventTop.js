import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import './EventTop.css';

const chipData = [
  { label: '전체 이벤트', path: '/event/eventAll' },
  { label: '진행중인 이벤트', path: '/event/eventNow' },
  { label: '종료된 이벤트', path: '/event/eventEnd' },
];

function EventTop() {
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

  const geteventTitle = () => {
    switch (location.pathname) {
      case '/event/eventAll':
        return '전체 이벤트';
      case '/event/eventNow':
        return '진행중인 이벤트';
      case '/event/eventEnd':
        return '종료된 이벤트';
      default:
        return 'Chee Us 이벤트';
    }
  };

  const shouldShowSearch = () => {
    return ['/event/eventAll', '/event/eventNow', '/event/eventEnd'].includes(location.pathname);
  };

  return (
    <div>
      <div className="event-page-top">
        {geteventTitle()}
        {shouldShowSearch() && (
          <div className="event-top">
            <input
              type="text"
              className="event-search"
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

export default EventTop;
