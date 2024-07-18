import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import BoardTop from '../board/BoardTop';
import Pagination from '@mui/material/Pagination';
import { selectBoards, toggleLike, selectLikedMap } from '../../store/BoardSlice';
import './shortForm.css';

const ShortForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  const likedMap = useSelector(selectLikedMap);
  const [hoveredBoard, setHoveredBoard] = useState(null);
  const boardRefs = useRef({});


  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const handleLikeClick = (id) => {
    dispatch(toggleLike(id));
  };

  const handleCreatePost = () => {
    navigate('/board/shortform/write');
  };

  const handleMouseEnter = (videoUrl) => {
    setHoveredBoard(videoUrl);
    const boardElement = boardRefs.current[videoUrl];
    if (boardElement && boardElement.paused) {
      boardElement.play().catch(error => {
        console.error('비디오 플레이 실패 :', error);
      });
    }
  };

  const totalPages = Math.ceil(boards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBoards = boards.slice(startIndex, startIndex + itemsPerPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleMouseLeave = (videoUrl) => {
    setHoveredBoard(null);
    const boardElement = boardRefs.current[videoUrl];
    if (boardElement && !boardElement.paused) {
      boardElement.pause();
      boardElement.currentTime = 0;
    }
  };

  useEffect(() => {
    boards.forEach(board => {
      boardRefs.current[board.videoUrl] = document.getElementById(board.videoUrl);
    });
  }, [boards]);

  const handleCardClick = (id) => {
    navigate(`/board/shortform/detail/${id}`);
  };

  return (
    <>
      <BoardTop />
      <div className="shortform-container">
        <div className="video-card-container">
          {boards.map((board) => (
            board.category === 2 && ( // 카테고리가 2인 경우에만 렌더링
              <Card
                key={board.id}
                variant="plain"
                className="video-card"
                onMouseEnter={() => handleMouseEnter(board.videoUrl)}
                onMouseLeave={() => handleMouseLeave(board.videoUrl)}
                onClick={() => handleCardClick(board.id)}
              >
                <Box className="card-video">
                  <AspectRatio ratio="2/4">
                    <CardCover className="card-cover">
                      <video
                        id={board.videoUrl}
                        loop
                        muted
                        ref={el => boardRefs.current[board.videoUrl] = el}
                        className="card-video video-element"
                        autoPlay={hoveredBoard === board.videoUrl}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeClick(board.id);
                      }}
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
            )
          ))}
        </div>
      </div><div className="create-post-container">
          <button onClick={handleCreatePost} className="create-post-button">
            게시글 작성
          </button>
        </div>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
          variant="outlined"
          sx={{
            '& .MuiPaginationItem-root': {
              color: 'black', 
            },
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: 'black', 
              color: 'white',
            },
            '& .MuiPaginationItem-root:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)', 
            },
          }}
          className="pagination"
        />
    </>
  );
};

export default ShortForm;
