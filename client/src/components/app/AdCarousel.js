import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './adCarousel.css';

function AdCarousel({ interval = 5000 }) {
  const slides = [
    {
      src: `${process.env.PUBLIC_URL}/images/slide2.png`,
      alt: '첫 번째 슬라이드',
      href: '/match',
      title: '혜화역 주정뱅이!',
      caption: '주인장이 직접 만든 꼴레뇨!! 주말 한정 10인분만 팝니다!'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/slide1.png`,
      alt: '두 번째 슬라이드',
      href: '/together',
      title: '동탄 막걸리나',
      caption: '여름 한정!!! 신상 복숭아 막걸리 출시'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/slide3.png`,
      alt: '세 번째 슬라이드',
      href: '/board',
      title: '부안 격포리',
      caption: '탁 트인 바다 보며 마시는 수입 맥주!!'
    },
    {
      src: `${process.env.PUBLIC_URL}/images/slide4.png`,
      alt: '네 번째 슬라이드',
      href: '/magazine',
      title: '100여종의 술을 맛 볼 수 있는 메가쇼!',
      caption: '수원 컨벤션 센터에서 열립니다!!'
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
              <br/>
              <h3>{slide.title}</h3>
              <br/>
              <p>{slide.caption}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default AdCarousel;
