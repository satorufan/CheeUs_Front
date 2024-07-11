import React from 'react';
import { useNavigate } from 'react-router-dom';
import './boardTop.css';

const chipData = [
  { label: '자유 게시판', path: '/board/community' },
  { label: '숏폼 게시판', path: '/board/shortform' },
  { label: '이벤트 게시판', path: '/board/eventboard' }
];

function BoardTop() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div className="board-page-top">게시판</div>
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