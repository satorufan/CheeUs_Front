import React from 'react';
import BoardTop from './BoardTop';
import BoardCategory from './BoardCategory';
import AdCarousel from '../app/AdCarousel';
import './boardPage.css';

function BoardPage() {

  return (
    <div className="board-pagelist-container">
      <BoardTop />
      <BoardCategory />
      <AdCarousel interval={5000} />
    </div>
  );
}

export default BoardPage;