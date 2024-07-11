import React, { useState, useRef, useEffect } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Typography from '@mui/joy/Typography';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import './shortForm.css'; // 해당 CSS 파일이 필요합니다.
import BoardTop from '../board/BoardTop';

// 예시 데이터
const exampleData = [
  {
    id: 1,
    author_id: 101,
    author_name: '뭐임마', 
    category: 1,
    title: '첫 번째 비디오 게시물',
    content: '첫 번째 비디오 게시물 어쩌고 저쩌고',
    writeday: '2024-07-11',
    views: 50,
    like: 10,
    repl_cnt: 3,
    media: 'V', 
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' 
  },
  {
    id: 2,
    author_id: 102,
    author_name: 'Jane Smith', 
    category: 1,
    title: '두 번째 비디오 게시물',
    content: '두 번째 비디오 게시물', 
    writeday: '2024-07-10',
    views: 30,
    like: 5,
    repl_cnt: 2,
    media: 'V',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4'
  },
  {
    id: 3,
    author_id: 103,
    author_name: 'Michael Johnson', 
    category: 2,
    title: '세 번째 비디오 게시물',
    content: '세 번째 비디오 게시물', 
    writeday: '2024-07-09',
    views: 20,
    like: 8,
    repl_cnt: 1,
    media: 'V',
    videoUrl: 'https://assets.codepen.io/6093409/river.mp4'
  },
  {
    id: 4,
    author_id: 103,
    author_name: 'Michael Johnson', 
    category: 2,
    title: '네 번째 비디오 게시물',
    content: '네 번째 비디오 게시물', 
    writeday: '2024-07-09',
    views: 25,
    like: 6,
    repl_cnt: 2,
    media: 'V',
    videoUrl: 'https://assets.codepen.io/6093409/river.mp4'
  },
  {
    id: 5,
    author_id: 103,
    author_name: 'Michael Johnson', 
    category: 2,
    title: '다섯 번째 비디오 게시물',
    content: '다섯 번째 비디오 게시물', 
    writeday: '2024-07-09',
    views: 18,
    like: 7,
    repl_cnt: 1,
    media: 'V',
    videoUrl: 'https://assets.codepen.io/6093409/river.mp4'
  }
];

const ShortForm = () => {
  const [likedMap, setLikedMap] = useState({});
  const [hoveredVideo, setHoveredVideo] = useState(null); // State to track hovered video URL
  const videoRefs = useRef({});

  // 좋아요 클릭 처리
  const handleLikeClick = (id) => {
    setLikedMap(prevLikedMap => ({
      ...prevLikedMap,
      [id]: !prevLikedMap[id]
    }));
  };

  // 비디오 마우스 오버 시 재생
  const handleMouseEnter = (videoUrl) => {
    setHoveredVideo(videoUrl);
    const videoElement = videoRefs.current[videoUrl];
    if (videoElement && videoElement.paused) {
      videoElement.play().catch(error => {
        console.error('비디오 플레이 실패 :', error);
      });
    }
  };

  // 비디오 마우스 벗어날 시 정지 및 초기화
  const handleMouseLeave = (videoUrl) => {
    setHoveredVideo(null);
    const videoElement = videoRefs.current[videoUrl];
    if (videoElement && !videoElement.paused) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  // 비디오 요소들을 useRef를 통해 저장
  useEffect(() => {
    exampleData.forEach(board => {
      videoRefs.current[board.videoUrl] = document.getElementById(board.videoUrl);
    });
  }, []);

  return (
    <>
      <BoardTop />
      <div className="shortform-container">
        <div className="video-card-container">
          {exampleData.map((board) => (
            <Card
              key={board.id}
              variant="plain"
              className="video-card"
              onMouseEnter={() => handleMouseEnter(board.videoUrl)}
              onMouseLeave={() => handleMouseLeave(board.videoUrl)}
            >
              <Box className="card-video">
                <AspectRatio ratio="2/4">
                  <CardCover className="card-cover">
                    <video
                      id={board.videoUrl}
                      loop
                      muted
                      ref={el => videoRefs.current[board.videoUrl] = el}
                      className="card-video video-element"
                      autoPlay={hoveredVideo === board.videoUrl} 
                    >
                      <source
                        src={board.videoUrl}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </CardCover>
                </AspectRatio>
              </Box>
              <div className="video-content">
                {board.title}
              </div>
              <Box className="card-content">
                <Avatar
                  src={`https://images.unsplash.com/profile-${board.author_id}?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff`}
                  size="sm"
                  sx={{ '--Avatar-size': '1.5rem' }}
                  className="card-avatar"
                />
                <div>
                  <div className='short-author'>
                    {board.author_name}
                  </div>
                </div>
                <div className="card-icons-container">
                  <div
                    className="card-icon-like"
                    onClick={() => handleLikeClick(board.id)}
                  >
                    <Favorite color={likedMap[board.id] ? 'error' : 'action'} />
                    {likedMap[board.id] ? board.like + 1 : board.like}
                  </div>
                  <div className="card-icon">
                    <Visibility />
                    {board.views}
                  </div>
                </div>
              </Box>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShortForm;