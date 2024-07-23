import React, { useContext, useEffect } from 'react';
import './main.css';
import Carousel from 'react-bootstrap/Carousel';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';

function Main() {
  const sweetalert = (title, contents, icon, confirmButtonText) => {
    Swal.fire({
        title: title,
        text: contents,
        icon: icon,
        confirmButtonText: confirmButtonText
    });
  };
  const nickname = useLocation();
  
  useEffect(()=>{
    if(nickname.state) {
      sweetalert(nickname.state.logined + "님 환영합니다." ,"","","확인");
    }
  }, [nickname]);

  return (
    <div className="main-container">
      <div className="video-background">
        <video autoPlay muted loop>
          <source src={`${process.env.PUBLIC_URL}/images/mainvideo.mp4`} type="video/mp4" />
        </video>
      </div>
      <div className="main-carousel">
        <Carousel>
          <Carousel.Item interval={5000}>
            <a href="/match">
              <img
                className="d-block w-100"
                src={`${process.env.PUBLIC_URL}/images/slide1.png`}
                alt="첫 번째 슬라이드"
              />
            </a>
            <Carousel.Caption>
              <h3>둘이 마셔요!</h3>
              <p>나와 술 취향이 비슷한 사람과 한 잔 해요!</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <a href="/together">
              <img
                className="d-block w-100"
                src={`${process.env.PUBLIC_URL}/images/slide2.png`}
                alt="두 번째 슬라이드"
              />
            </a>
            <Carousel.Caption>
              <h3>함께 마셔요!</h3>
              <p>내 주변의 술 모임을 찾아보아요!</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <a href="/board">
              <img
                className="d-block w-100"
                src={`${process.env.PUBLIC_URL}/images/slide3.png`}
                alt="세 번째 슬라이드"
              />
            </a>
            <Carousel.Caption>
              <h3>게시판</h3>
              <p>술과 관련한 다양한 이야기를 나누어요</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <a href="/magazine">
              <img
                className="d-block w-100"
                src={`${process.env.PUBLIC_URL}/images/slide4.png`}
                alt="네 번째 슬라이드"
              />
            </a>
            <Carousel.Caption>
              <h3>매거진</h3>
              <p>술 관련 팝업스토어 & 정보를 알아보아요</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="main-video-content">
        <h1>혼술 하기 싫은 날,</h1>
        <p>같이 한 잔 할까요?</p>
      </div>
    </div>
  );
}

export default Main;