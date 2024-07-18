import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../store/BoardSlice';
import Avatar from '@mui/material/Avatar';
import { Favorite, Visibility, Bookmark } from '@mui/icons-material';
import { AuthContext } from '../login/OAuth'; // AuthContext 가져오기
import { jwtDecode } from "jwt-decode";
import './detailBoard.css';
import Swal from 'sweetalert2';

const DetailBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  const { token } = useContext(AuthContext); // 현재 사용자 정보 가져오기

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  const board = boards.find(b => b.id === parseInt(id, 10)); // id를 정수형으로 변환

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

    // 디코딩된 토큰 정보 콘솔 출력
    console.log('디코딩된 토큰 정보:', decodedToken);

    // 작성자 정보 콘솔 출력
    console.log('작성자 정보:', {
      email: decodedToken?.email,
      author_id: board?.author_id,
      name: board?.author_name
    });

  }, [board, id, navigate, decodedToken]);

  const handleAddComment = (e) => {
    e.preventDefault();
    // 댓글 추가 로직 구현
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleScrap = () => {
    setScraped(!scraped);
  };

  const handleDelete = () => {
    Swal.fire({
      title: '정말로 삭제하시겠습니까?',
      text: '이 작업은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'black',
      cancelButtonColor: '#darkgray',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        // 삭제 로직 구현 
        console.log('게시물이 삭제되었습니다.');
      }
    });
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
          {board.category === 2 ? (
            <div className="detail-video-container">
              <div className="detail-video-wrapper">
                <video className="detail-video" controls>
                  <source src={board.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="detail-video-content">
                <p>{board.content}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="detail-content">{board.content}</p>
              {board.photoes && (
                <div className="detail-image-container">
                  <img className="detail-image" src={board.photoes} alt={board.title} />
                </div>
              )}
            </>
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
          {decodedToken && (decodedToken.email === board.author_id ) && (
            <>
              {board.category === 1 && (
                <button
                  onClick={() => navigate(`/board/freeboard/edit/${id}`)}
                  className="detail-edit-btn"
                >
                  수정하기
                </button>
              )}

              {board.category === 2 && (
                <button
                  onClick={() => navigate(`/board/shortform/edit/${id}`)}
                  className="detail-edit-btn"
                >
                  수정하기
                </button>
              )}

              {board.category === 3 && (
                <button
                  onClick={() => navigate(`/board/event/edit/${id}`)}
                  className="detail-edit-btn"
                >
                  수정하기
                </button>
              )}
              <button
                onClick={handleDelete}
                className="detail-edit-btn"
              >
                삭제하기
              </button>
            </>
          )}
          {/*
          {true && (
            <>
              {board.category === 1 && (
                <button
                  onClick={() => navigate(`/board/freeboard/edit/${id}`)}
                  className="detail-edit-btn"
                >
                  수정하기
                </button>
              )}

              {board.category === 2 && (
                <button
                  onClick={() => navigate(`/board/shortform/edit/${id}`)}
                  className="detail-edit-btn"
                >
                  수정하기
                </button>
              )}

              {board.category === 3 && (
                <button
                  onClick={() => navigate(`/board/event/edit/${id}`)}
                  className="detail-edit-btn"
                >
                  수정하기
                </button>
              )}
              <button
                onClick={handleDelete}
                className="detail-edit-btn"
              >
                삭제하기
              </button>
            </>
          )}
            */}
        </div>
      </div>
    </div>
  );
};

export default DetailBoard;
