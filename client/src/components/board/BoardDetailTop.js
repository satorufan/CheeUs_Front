import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoardDetailTop = ({ category }) => {
  const navigate = useNavigate();
  const getCategoryDetails = (category) => {
    switch (category) {
      case 1:
        return { title: '자유 게시판', path: '/board/freeboard' };
      case 2:
        return { title: '숏폼 게시판', path: '/board/shortform' };
      case 3:
        return { title: '이벤트 게시판', path: '/board/eventboard' };
      default:
        return { title: '게시판', path: '/board' };
    }
  };

  const { title, path } = getCategoryDetails(category);

  const handleNavigate = () => {
    navigate(path);
  };

  return (
    <>
      <div className="board-page-top">{title}</div>
      <div className="detail-free-header">
        <button className="detail-to-list" onClick={handleNavigate}>
          {title} 목록
        </button>
      </div>
    </>
  );
};

export default BoardDetailTop;