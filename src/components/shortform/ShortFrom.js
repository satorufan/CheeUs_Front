import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import BoardTop from '../board/BoardTop';
import { selectVideos, toggleLike, selectLikedMap } from '../../store/BoardSlice';
import './shortForm.css'; 

const ShortForm = () => {
  const dispatch = useDispatch();
  const videos = useSelector(selectVideos);
  const likedMap = useSelector(selectLikedMap);
  const [hoveredVideo, setHoveredVideo] = useState(null); 
  const videoRefs = useRef({});

  // 좋아요 클릭 처리
  const handleLikeClick = (id) => {
    dispatch(toggleLike(id));
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
    videos.forEach(video => {
      videoRefs.current[video.videoUrl] = document.getElementById(video.videoUrl);
    });
  }, [videos]);

  return (
    <>
      <BoardTop />
      <div className="shortform-container">
        <div className="video-card-container">
          {videos.map((video) => (
            <Card
              key={video.id}
              variant="plain"
              className="video-card"
              onMouseEnter={() => handleMouseEnter(video.videoUrl)}
              onMouseLeave={() => handleMouseLeave(video.videoUrl)}
            >
              <Box className="card-video">
                <AspectRatio ratio="2/4">
                  <CardCover className="card-cover">
                    <video
                      id={video.videoUrl}
                      loop
                      muted
                      ref={el => videoRefs.current[video.videoUrl] = el}
                      className="card-video video-element"
                      autoPlay={hoveredVideo === video.videoUrl} 
                    >
                      <source
                        src={video.videoUrl}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </CardCover>
                </AspectRatio>
              </Box>
              <div className="video-content">
                {video.title}
              </div>
              <Box className="card-content">
                <Avatar
                  src={`https://images.unsplash.com/profile-${video.author_id}?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff`}
                  size="sm"
                  sx={{ '--Avatar-size': '1.5rem' }}
                  className="card-avatar"
                />
                <div>
                  <div className='short-author'>
                    {video.author_name}
                  </div>
                </div>
                <div className="card-icons-container">
                  <div
                    className="card-icon-like"
                    onClick={() => handleLikeClick(video.id)}
                  >
                    <Favorite color={likedMap[video.id] ? 'error' : 'action'} />
                    {likedMap[video.id] ? video.like + 1 : video.like}
                  </div>
                  <div className="card-icon">
                    <Visibility />
                    {video.views}
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