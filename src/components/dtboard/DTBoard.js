import React from 'react';
import './DTBoard.css';
import DTBoardContent from './DTBoardContent';
import DTBoardMap from './DTBoardMap';

const DTBoard = () => {
  const posts = [
    { id: 1, title: '호수공원 벤치에서 맥주드실분', description: 'Menu description.' },
    { id: 2, title: '다운타운에서 맥주 같이드실분', description: 'Menu description.' },
    { id: 3, title: '피맥 조지실분 선착순 3명 구합니다', description: '피자네버슬립스-잠실점 | 2024.07.03 6:30pm' },
    { id: 4, title: '곱소하실분 - 나루역 4층 4명', description: 'Menu description.' },
    { id: 5, title: '참치 배터지게 드실분있나요?', description: 'Menu description.' },
  ];

  return (
    <div className="board-layout">
      <div className="board-content">
        <DTBoardContent posts={posts} />
        <DTBoardMap />
      </div>
    </div>
  );
};

export default DTBoard;
