import React, { useState } from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import BoardTop from '../board/BoardTop';
import './freeBoard.css'; // CSS 파일 import

// 예시 데이터
const exampleData = {
  "board": [
    {
      "id": 1,
      "author_id": 101,
      "author_name": "티라노사우르스",  // 예시 데이터에 작성자 이름 추가
      "category": 1,
      "title": "첫 번째 게시물",
      "content": "첫 번째 게시물 내용입니다.첫 번째 게시물 내용입니다.첫 번째 게시물 내용입니다.첫 번째 게시물 내용입니다.첫 번째 게시물 내용입니다.첫 번째 게시물 내용입니다.첫 번째 게시물 내용입니다.첫 번째 게시물 내용입니다.첫 번째 게시물 내용입니다.",
      "writeday": "2024-07-11",
      "views": 50,
      "like": 10,
      "repl_cnt": 3,
      "photoes": "https://www.w3schools.com/w3images/mac.jpg" // 이미지 URL 추가
    },
    {
      "id": 2,
      "author_id": 102,
      "author_name": "Jane Smith",  // 예시 데이터에 작성자 이름 추가
      "category": 1,
      "title": "두 번째 게시물",
      "content": "두 번째 게시물 내용입니다.",
      "writeday": "2024-07-10",
      "views": 30,
      "like": 5,
      "repl_cnt": 2,
      "photoes": "" // 빈 이미지 URL
    },
    {
      "id": 3,
      "author_id": 103,
      "author_name": "Michael Johnson",  // 예시 데이터에 작성자 이름 추가
      "category": 2,
      "title": "세 번째 게시물",
      "content": "세 번째 게시물 내용입니다.",
      "writeday": "2024-07-09",
      "views": 20,
      "like": 8,
      "repl_cnt": 1,
      "photoes": "" // 빈 이미지 URL
    },
    {
      "id": 4,
      "author_id": 104,
      "author_name": "Emily Brown",  // 예시 데이터에 작성자 이름 추가
      "category": 2,
      "title": "네 번째 게시물",
      "content": "네 번째 게시물 내용입니다.",
      "writeday": "2024-07-08",
      "views": 25,
      "like": 6,
      "repl_cnt": 2,
      "photoes": "https://www.w3schools.com/html/frenchfood.jpg" // 이미지 URL 추가
    }
  ]
};

const FreeBoard = () => {
  const [likedMap, setLikedMap] = useState({});

  // 좋아요 클릭 처리
  const handleLikeClick = (id) => {
    setLikedMap(prevLikedMap => ({
      ...prevLikedMap,
      [id]: !prevLikedMap[id]
    }));
  };

  return (
    <>
      <BoardTop />
      <div className="freeboard-container">
        <div className="freeboard-card-container">
          {exampleData.board.map((board) => (
            <Card
              key={board.id}
              variant="plain"
              className="freeboard-card"
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
                  </div >
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

export default FreeBoard;