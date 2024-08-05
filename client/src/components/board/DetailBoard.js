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
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';



const DetailBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  const { token } = useContext(AuthContext); // 현재 사용자 정보 가져오기
  const [lastCategory, setLastCategory] = useState(null);

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  const board = boards.find(b => b.id === parseInt(id, 10)); // id를 정수형으로 변환

  const [liked, setLiked] = useState(false);
  const [scraped, setScraped] = useState(false);

  useEffect(() => {
    if (!board) return;

    // 중복 navigate 방지를 위해 이전 카테고리 상태를 저장하고 비교
    if (board.category !== lastCategory) {
      setLastCategory(board.category);
      let path = `/`; // 기본 경로 설정

      switch (board.category) {
        case 1:
          path = `/board/freeboard/detail/${id}`;
          break;
        case 2:
          path = `/board/shortform/detail/${id}`;
          break;
        case 3:
          path = `/board/eventboard/detail/${id}`;
          break;
        default:
          // 기본 경로는 홈이나 에러 페이지 등으로 설정 가능
          path = `/`;
      }
      navigate(path);
    }
  }, [board, id, navigate, lastCategory]);

  /*
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
     navigate(`/board/eventboard/detail/${id}`);
   }

 }, [board, id, navigate, decodedToken]);
*/

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

  const handleDelete = (id, category) => {
    // console.log("id 수신 확인 : " + board.id);
    // console.log("category 수신 확인 : " + board.category);
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
        axios.delete(`http://localhost:8080/board/delete/${board.id}`)
            .then((response) => {
              console.log('게시물이 삭제되었습니다.', response.data);
              Swal.fire(
                  '삭제 완료!',
                  '게시물이 성공적으로 삭제되었습니다.',
                  'success'
              ).then(() => {
                // category에 따라 navigate 경로 설정
                let path = '/';
                switch (board.category) {
                  case 1:
                    path = '/board/freeboard';
                    break;
                  case 2:
                    path = '/board/shortform';
                    break;
                  case 3:
                    path = '/board/eventboard';
                    break;
                }
                navigate(path);
              });
            })
            .catch((error) => {
              console.error('삭제 중 오류가 발생했습니다:', error);
              Swal.fire(
                  '삭제 실패',
                  '게시물 삭제 중 문제가 발생했습니다.',
                  'error'
              );
            });
      }
    });
  };

/*
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
*/

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
          <div className="detail-author">{board.nickname}</div>
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
              <p>{board.content}</p>
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
                  onClick={() => navigate(`/board/eventboard/edit/${id}`)}
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
