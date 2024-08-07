import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './adCarousel.css';

function AdCarousel({ interval = 5000 }) {
  // 내부에서 하드코딩된 이미지 배열과 관련 링크 및 캡션
  const slides = [
    {
      src: `${process.env.PUBLIC_URL}/images/slide1.png`,
      alt: '첫 번째 슬라이드',
      href: '/match',
      title: '둘이 마셔요!',
      caption: '나와 술 취향이 비슷한 사람과 한 잔 해요!'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/slide2.png`,
      alt: '두 번째 슬라이드',
      href: '/together',
      title: '함께 마셔요!',
      caption: '내 주변의 술 모임을 찾아보아요!'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/slide3.png`,
      alt: '세 번째 슬라이드',
      href: '/board',
      title: '게시판',
      caption: '술과 관련한 다양한 이야기를 나누어요'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/slide4.png`,
      alt: '네 번째 슬라이드',
      href: '/magazine',
      title: '매거진',
      caption: '술 관련 팝업스토어 & 정보를 알아보아요'
    }
  ];

  return (
    <div className="ad-carousel">
      <Carousel interval={interval}>
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <a href={slide.href}>
              <img
                className="d-block w-100"
                src={slide.src}
                alt={slide.alt}
              />
            </a>
            <Carousel.Caption>
              <h3>{slide.title}</h3>
              <p>{slide.caption}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default AdCarousel;
