import React, { useState } from 'react';
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
import { selectBoards, toggleLike, selectLikedMap } from '../../store/BoardSlice';
import Pagination from '@mui/material/Pagination';
import '../freeboard/freeBoard.css';

const EventBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  const likedMap = useSelector(selectLikedMap);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const handleLikeClick = (id) => {
    dispatch(toggleLike(id));
  };

  const handleCardClick = (id) => {
    navigate(`/board/eventboard/detail/${id}`);
  };

  const handleCreatePost = () => {
    navigate('/board/eventboard/write');
  };

//페이지네이션
  const filteredBoards = boards.filter(board => board.category === 3);

  const totalPages = Math.ceil(filteredBoards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBoards = filteredBoards.slice(startIndex, startIndex + itemsPerPage);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <BoardTop />
      <div className="freeboard-container">
        <div className="freeboard-card-container">
          {currentBoards
            .filter(board => board.category === 3)
            .map((board) => (
              <Card
                key={board.id}
                variant="plain"
                className="freeboard-card"
                onClick={() => handleCardClick(board.id)}
              >
                <Box className="card-video">
                  <AspectRatio ratio="4/3">
                    {board.photoes ? (
                      <CardCover className="card-cover">
                        <img
                          src={board.photoes}
                          alt="게시물 사진"
                          className="card-photo"
                        />
                        <div className="card-overlay-text">
                          {board.content}
                        </div>
                      </CardCover>
                    ) : (
                      <CardCover className="card-cover">
                        <div className="content-text">
                          {board.content}
                        </div>
                      </CardCover>
                    )}
                  </AspectRatio>
                </Box>
                <Box>
                  <div className="freeboard-title">
                    {board.title}
                  </div>
                </Box>
                <Box className="card-content">
                  <Avatar
                    src={`https://images.unsplash.com/profile-${board.author_id}?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff`}
                    size="sm"
                    sx={{ '--Avatar-size': '1.5rem' }}
                    className="card-avatar"
                  />
                  <div>
                    <div className="card-author-name">
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
            ))}
        </div>
      </div>
      <div className="create-post-container">
        <button onClick={handleCreatePost} className="create-post-button">
          게시글 작성
        </button>
      </div>

      {/* Pagination 컴포넌트 */}
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

export default EventBoard;
