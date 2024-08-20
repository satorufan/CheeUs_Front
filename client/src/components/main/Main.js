import React, { useEffect, useState, useRef } from 'react';
import './main.css';
import Carousel from 'react-bootstrap/Carousel';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AdCarousel from '../app/AdCarousel';

function Main() {
  const [visibleSections, setVisibleSections] = useState({});
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

  useEffect(() => {
    const sections = Array.from(greyRef.current.querySelectorAll('.main-section'));
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          } else {
            setTimeout(() => {
              setVisibleSections((prev) => ({
                ...prev,
                [entry.target.id]: false,
              }));
            }, 100); // 500ms 후에 opacity를 0으로 설정
          }
        });
      },
      { threshold: 1 } // Threshold를 0.5로 변경
    );
  
    sections.forEach((section) => observer.observe(section));
  
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const getOpacity = (id) => {
    return visibleSections[id] ? 1 : 0;
  };

  const handleSectionClick = (path) => {
    navigate(path);
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
            className="main-section image-left "
            id="firstText"
            style={{ opacity: getOpacity('firstText') }}
            onClick={() => handleSectionClick('/matching')} // 클릭 시 이동
          >
            <div className="main-section-image">
              <img src={`${process.env.PUBLIC_URL}/images/match.png`} id="mainImage" alt="Main" />
            </div>
            <div className="main-section-text">
              <h1>둘이 마셔요</h1>
              <div>
                나와 술 취향이 같은 사람을 찾아<br/>
                스와이프 해보세요!<br />
                좋은 술 친구를 얻게 될거에요
              </div>
            </div>
          </div>

          <div
            className="main-section image-right"
            id="secondText"
            style={{ opacity: getOpacity('secondText') }}
            onClick={() => handleSectionClick('/dtboard')} 
          >
            <div className="main-section-text">
              <h1>함께 마셔요</h1>
              <div>
                내 주변에 술 번개 모임을 찾아보세요! <br />
                여럿이 만나면 즐거움이 배가 될거에요
              </div>
            </div>
            <div className="main-section-image">
              <img src={`${process.env.PUBLIC_URL}/images/together.png`} id="mainImage" />
            </div>
          </div>

          <div
            className="main-section image-left"
            id="thirdText"
            style={{ opacity: getOpacity('thirdText') }}
            onClick={() => handleSectionClick('/chatpage')}
          >
            <div className="main-section-image">
              <img src={`${process.env.PUBLIC_URL}/images/chat.png`} id="mainImage" alt="Main" />
            </div>
            <div className="main-section-text">
              <h1>톡톡! 채팅</h1>
              <div>
                마음 맞는 친구를 찾았나요? <br />
                채팅을 보내 친구가 되어보아요!
              </div>
            </div>
          </div>

          <div
            className="main-section image-right"
            id="fourthText"
            style={{ opacity: getOpacity('fourthText') }}
            onClick={() => handleSectionClick('/board')} 
          >
            <div className="main-section-text">
              <h1>게시판</h1>
              <div>
                오늘은 어떤 컨텐츠를 구경할까? <br />
                취중진담, 이벤트, 숏폼까지!<br />
                다양한 🍻 이야기가 기다리고 있어요!
              </div>
            </div>
            <div className="main-section-image">
              <img src={`${process.env.PUBLIC_URL}/images/board.png`} id="mainImage" alt="Main" />
            </div>
          </div>

          <div
            className="main-section image-left"
            id="fifthText"
            style={{ opacity: getOpacity('fifthText') }}
            onClick={() => handleSectionClick('/magazine')}
          >
            <div className="main-section-image">
              <img src={`${process.env.PUBLIC_URL}/images/magazin.png`} id="mainImage" alt="Main" />
            </div>
            <div className="main-section-text">
              <h1>매거진</h1>
              <div>
                Chee-Us가 들려주는 술 이야기 <br />
                맛있고 재미있는 술 정보들!<br />
                이벤트도 기다리고 있어요
              </div>
            </div>
          </div>
          <div>
        <AdCarousel/>
        </div>
        </div>
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
