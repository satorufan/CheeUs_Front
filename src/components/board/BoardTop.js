import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './boardTop.css';

const chipData = [
  { label: '자유 게시판', path: '/board/freeboard' },
  { label: '숏폼 게시판', path: '/board/shortform' },
  { label: '이벤트 게시판', path: '/board/eventboard' }
];

function BoardTop() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // 현재 경로에 따라 제목 설정
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

  return (
    <div>
      <div className="board-page-top">{getBoardTitle()}</div>
      <div className="category-container">
        {chipData.map((data, index) => (
          <button
            className="chip-name"
            key={index}
            onClick={() => handleNavigation(data.path)}
          >
            {data.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BoardTop;