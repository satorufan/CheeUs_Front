import React from 'react';
import BoardTop from './BoardTop';
import BoardCategory from './BoardCategory';
import AdCarousel from '../app/AdCarousel';
import './boardPage.css';

function BoardPage() {
  // 광고
  const images = [
    { src: `${process.env.PUBLIC_URL}/images/slide1.png`, alt: '첫 번째 슬라이드' },
    { src: `${process.env.PUBLIC_URL}/images/slide2.png`, alt: '두 번째 슬라이드' },
    { src: `${process.env.PUBLIC_URL}/images/slide3.png`, alt: '세 번째 슬라이드' },
  ];

  return (
    <div className="board-pagelist-container">
      <BoardTop />
      <BoardCategory />
      <AdCarousel images={images} interval={5000} />
    </div>
  );
}

export default BoardPage;