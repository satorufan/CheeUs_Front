import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import './MagazineTop.css';

const chipData = [
  { label: '이달의 POP-UP', path: '/magazine/popup' },
  { label: '술 TMI', path: '/magazine/tmi' },
  { label: '섞어섞어 Recipe', path: '/magazine/recipe' },
  { label: '이주의 술집추천', path: '/magazine/recommend' },
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

  const getmagazineTitle = () => {
    if (location.pathname.match(/^\/magazine\/detail\/popup\/\d+$/)) {
      return '이달의 POP-UP';
    }
    if (location.pathname.match(/^\/magazine\/detail\/tmi\/\d+$/)) {
      return '술 TMI';
    }
    if (location.pathname.match(/^\/magazine\/detail\/recipe\/\d+$/)) {
      return '섞어섞어 Recipe';
    }
    if (location.pathname.match(/^\/magazine\/detail\/recommend\/\d+$/)) {
      return '이주의 술집추천';
    }
    switch (location.pathname) {
      case '/magazine/popup':
        return '이달의 POP-UP';
      case '/magazine/tmi':
        return '술 TMI';
      case '/magazine/recipe':
        return '섞어섞어 Recipe';
      case '/magazine/recommend':
        return '이주의 술집추천';
      default:
        return 'Chee Us 메거진';
    }
  };

  const shouldShowSearch = () => {
    return ['/magazine/popup', '/magazine/tmi', '/magazine/recipe', '/magazine/recommend'].includes(location.pathname);
  };

  return (
    <div>
      <div className="magazine-page-top">
        {getmagazineTitle()}
        {shouldShowSearch() && (
          <div className="magazine-top">
            <input
              type="text"
              className="magazine-search"
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
