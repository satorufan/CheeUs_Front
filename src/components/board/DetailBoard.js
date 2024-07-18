import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../store/BoardSlice';
import './detailBoard.css'; 
import Avatar from '@mui/material/Avatar';
import { Favorite, Visibility, Bookmark } from '@mui/icons-material';
import { AuthContext } from '../login/OAuth'; // AuthContext 가져오기

const DetailBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  const { user } = React.useContext(AuthContext); // 현재 사용자 정보 가져오기

  const board = boards.find(b => b.id === parseInt(id));
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [scraped, setScraped] = useState(false);

  useEffect(() => {
    if (!board) {
      return; 
    }

    // 게시물 카테고리에 따라 경로 변경
    if (board.category === 1) {
      navigate(`/board/freeboard/detail/${id}`);
    } else if (board.category === 2) {
      navigate(`/board/shortform/detail/${id}`);
    } else if (board.category === 3) {
      navigate(`/board/event/detail/${id}`);
    }
  }, [board, id, navigate]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText('');
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleScrap = () => {
    setScraped(!scraped);
  };

  const handleDelete = () => {
    // 삭제 로직 구현 
    console.log('게시물이 삭제되었습니다.');
  };

  if (!board) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="detail-container">
      <div className="detail-post">
        <div className="detail-avatar-container">
          <Avatar
            src={board.author_photo} 
            sx={{ width: 40, height: 40 }}
            className="detail-avatar"
          />
          <div className="detail-author">{board.author_name}</div>
        </div>
        <div className="detail-title-container">
          <div className="detail-title">{board.title}</div>
          <div className="detail-writeday">{board.writeday}</div>
        </div>
        <div className="detail-content-container">
          <p className="detail-content">{board.content}</p>
          {board.photoes && (
            <div className="detail-image-container">
              <img className="detail-image" src={board.photoes} alt={board.title} />
            </div>
          )}
        </div>
        <div className="detail-board-info">
          <div className="left-info">
            <p>
              <Bookmark 
                color={scraped ? 'primary' : 'action'} 
                onClick={handleScrap}
                style={{ cursor: 'pointer' }}
              /> 
            </p>
            <p>
              <Favorite 
                color={liked ? 'error' : 'action'} 
                onClick={handleLike}
              /> 
              {liked ? board.like + 1 : board.like}
            </p>
          </div>
          <div className="right-info">
            <p>
              <Visibility /> {board.views}
            </p>
          </div>
        </div>
        <div className="detail-edit-container">
          {/* 로그인 사용자와 작성자가 같을 경우 수정 버튼 표시 나중에 주석처리 한걸로 수정하기*/}
          {/*
          {user && (user.email === board.author_email || true) && (
            <>
              <button
                onClick={() => navigate(`/board/edit/${id}`)}
                className="detail-edit-btn"
              >
                수정하기
              </button>
              <button
                onClick={handleDelete}
                className="detail-edit-btn"
              >
                삭제하기
              </button>
            </>
          )}
          */}

          {true && (
            <>
              <button
                onClick={() => navigate(`/board/edit/${id}`)}
                className="detail-edit-btn"
              >
                수정하기
              </button>
              <button
                onClick={handleDelete}
                className="detail-edit-btn"
              >
                삭제하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailBoard;
