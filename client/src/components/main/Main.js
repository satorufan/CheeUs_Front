import React, { useEffect, useState, useRef } from 'react';
import './main.css';
import Carousel from 'react-bootstrap/Carousel';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

function Main() {
  const [currentSection, setCurrentSection] = useState(null);
  const greyRef = useRef(null);
  const navigate = useNavigate();

  // SweetAlert 설정 함수
  const sweetalert = (title, contents, icon, confirmButtonText) => {
    Swal.fire({
      title: title,
      text: contents,
      icon: icon,
      confirmButtonText: confirmButtonText
    });
  };

  // 로그인 후 메시지 표시
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      sweetalert(location.state.logined + "님 환영합니다.", "", "", "확인");
      navigate('/', { replace: true });
    }
  }, []);
  

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (!greyRef.current) return;

      const sections = greyRef.current.querySelectorAll('.sticky-section');
      const parentRect = greyRef.current.getBoundingClientRect();
      let activeSection = null;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        
        // Debug
        //console.log(`Section ${index} top: ${rect.top}, bottom: ${rect.bottom}`);
        //console.log(`Parent top: ${parentRect.top}, bottom: ${parentRect.bottom}`);

        // 섹션이 부모 컨테이너의 시야에 들어오는 경우
        if (rect.top < parentRect.bottom-350 && rect.bottom > parentRect.top) {
          activeSection = index;
        }
      });

      setCurrentSection(activeSection);
    };

    const greyElement = greyRef.current;
    if (greyElement) {
      greyElement.addEventListener('scroll', handleScroll);
      handleScroll(); // 컴포넌트 마운트 시 초기화
    }

    return () => {
      if (greyElement) {
        greyElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // 섹션의 opacity를 계산하는 함수
  const getOpacity = (index) => {
    if (currentSection === null) return 0; // 기본값: 0

    // 현재 섹션이 활성화되어 있는 경우
    if (currentSection === index) return 1;

    // 인접 섹션이 활성화되어 있는 경우
    if (currentSection === index || currentSection === index + 1) return 0.5;

    // 그 외의 경우
    return 0;
  };

  return (
    <div className="main-container">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay muted loop>
          <source src={`${process.env.PUBLIC_URL}/images/mainvideo.mp4`} type="video/mp4" />
        </video>
      </div>

      {/* Grey Background and Sections */}
      <div className="sticy-container">
      <div className="grey" ref={greyRef}>
        <div
          className="main-section image-left sticky-section"
          id="firstText"
          style={{ opacity: getOpacity(0) }}
        >
          <div className="main-section-image">
            <img src={`${process.env.PUBLIC_URL}/images/shortform.jpg`} id="mainImage" alt="Main" />
          </div>
          <div className="main-section-text">
            <h1>둘이 마셔요</h1>
            <div>
              나와 술 취향이 같은 사람을 찾아 스와이프 해보세요!<br/>
              좋은 술 친구를 얻게 될거에요
            </div>
          </div>
        </div>

        <div
          className="main-section image-right sticky-section"
          id="secondText"
          style={{ opacity: getOpacity(1) }}
        >
          <div className="main-section-text">
            <h1>함께 마셔요</h1>
            <div>
              내 주변에 술 번개 모임을 찾아보세요! <br/>
              여럿이 만나면 즐거움이 배가 될거에요
            </div>
          </div>
          <div className="main-section-image">
            <img src={`${process.env.PUBLIC_URL}/images/shortform.jpg`} id="mainImage" />
          </div>
        </div>

        <div
          className="main-section image-left sticky-section"
          id="thirdText"
          style={{ opacity: getOpacity(2) }}
        >
          <div className="main-section-image">
            <img src={`${process.env.PUBLIC_URL}/images/shortform.jpg`} id="mainImage" alt="Main" />
          </div>
          <div className="main-section-text">
            <h1>톡톡! 채팅</h1>
            <div>
              마음 맞는 친구를 찾았나요? <br/>
              채팅을 보내 친구가 되어보아요!
            </div>
          </div>
        </div>

        <div
          className="main-section image-right sticky-section"
          id="fourthText"
          style={{ opacity: getOpacity(3) }}
        >
          <div className="main-section-text">
            <h1>게시판</h1>
            <div>
              오늘은 어떤 컨텐츠를 구경할까? <br/>
              취중진담, 이벤트, 영상으로 보는 술 이야기!<br/>
              다양한 이야기가 기다리고 있어요!
            </div>
          </div>
          <div className="main-section-image">
            <img src={`${process.env.PUBLIC_URL}/images/shortform.jpg`} id="mainImage" alt="Main" />
          </div>
        </div>

        <div
          className="main-section image-left sticky-section"
          id="fifthText"
          style={{ opacity: getOpacity(4) }}
        >
          <div className="main-section-image">
            <img src={`${process.env.PUBLIC_URL}/images/shortform.jpg`} id="mainImage" alt="Main" />
          </div>
          <div className="main-section-text" id="fifthText">
            <h1>매거진</h1>
            <div>
              Chee-Us가 들려주는 술 이야기 <br/>
              맛있고 재미있는 술 정보들!<br/>
              이벤트도 기다리고 있어요
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Carousel */}
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

      {/* Video Content */}
      <div className="main-video-content">
        <div className="typing">
          <h1>
            <span className="line line1">혼술 하기 싫은 날,</span>
            <span className="line line2">같이 한 잔 할까요?</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Main;
