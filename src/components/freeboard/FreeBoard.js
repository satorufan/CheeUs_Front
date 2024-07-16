import React from 'react';
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
import './freeBoard.css'; 

const FreeBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const boards = useSelector(selectBoards);
  const likedMap = useSelector(selectLikedMap);

  const handleLikeClick = (id) => {
    dispatch(toggleLike(id));
  };

  const handleCardClick = (id) => {
    navigate(`/board/freeboard/detail/${id}`); // 상세 페이지로 이동
  };

  return (
    <>
      <BoardTop />
      <div className="freeboard-container">
        <div className="freeboard-card-container">
          {boards
            .filter(board => board.category === 1) 
            .map((board) => (
              <Card
                key={board.id}
                variant="plain"
                className="freeboard-card"
                onClick={() => handleCardClick(board.id)} // 클릭 시 상세 페이지로 이동
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
    </>
  );
};

export default FreeBoard;
