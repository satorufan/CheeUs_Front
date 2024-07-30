import React from 'react';
import BoardTop from './BoardTop';
import BoardCategory from './BoardCategory';
import './boardPage.css';

function BoardPage() {
  return (
    <div className="board-pagelist-container">
      <BoardTop />
      <BoardCategory />
    </div>
  );
}

export default BoardPage;