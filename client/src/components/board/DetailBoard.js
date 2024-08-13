import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { usePosts } from '../dtboard/PostContext';
import { selectBoardAuthors, selectBoards, selectPageBoardsMedia, toggleLike, likeBoard } from '../../store/BoardSlice';
import Avatar from '@mui/material/Avatar';
import { Favorite, Visibility, Bookmark } from '@mui/icons-material';
import { AuthContext } from '../login/OAuth'; // AuthContext 가져오기
import { jwtDecode } from "jwt-decode";
import './detailBoard.css';
import Swal from 'sweetalert2';
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/firebase'; // Firebase 저장소 가져오기
import BoardDetailSkeleton from '../skeleton/BoardDetailSkeleton';
import useToProfile from '../../hooks/useToProfile';

const DetailBoard = () => {
  const { id } = useParams();
  const { memberEmail, serverUrl, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  const medias = useSelector(selectPageBoardsMedia);
  const authors = useSelector(selectBoardAuthors);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastCategory, setLastCategory] = useState(null);
  const [liked, setLiked] = useState(false)
  const dispatch = useDispatch();

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  const board = boards.find(b => b.id === parseInt(id, 10)); // id를 정수형으로 변환

  const [isScrapped, setIsScrapped] = useState(false);
  const { addScrap, checkScrap } = usePosts();
  const navigateToUserProfile = useToProfile();

  useEffect(()=>{
    if(board.category == 2 && authors && Object.keys(authors).length > 0 && Object.keys(medias).length > 0) {
      setIsLoaded(true);
    } else if(board.category != 2 && authors && Object.keys(authors).length > 0) {
      setIsLoaded(true);
    }
  }, [authors, medias]);

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

  const handleLike = async () => {
    if (!memberEmail) {
      Swal.fire('로그인 후 이용가능합니다');
      return;
    }
    try {
      await dispatch(likeBoard({ boardId: board.id, userEmail: memberEmail })).unwrap();
  
      setLiked(prevLiked => !prevLiked); 
  
    } catch (error) {
      Swal.fire('Oops! 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleScrap = () => {
    setIsScrapped(!isScrapped);
  };

  // 이미지 URL 추출 함수
  const extractImageUrls = (content) => {
    const regex = /!\[.*?\]\((.*?)\)/g;
    const urls = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      urls.push(match[1]);
    }
    return urls;
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
    }).then(async(result) => {
      if (result.isConfirmed) {
        // Firebase Storage에서 모든 이미지 삭제
        const toBeDeletedImages = extractImageUrls(board.content);
        if ( toBeDeletedImages.length > 0 ) {
          const deletePromises = toBeDeletedImages.map(photoUrl => {
            const imageRef = ref(storage, photoUrl);
            return deleteObject(imageRef)
              .then(() => {
                console.log(`이미지가 성공적으로 삭제되었습니다: ${photoUrl}`);
              })
              .catch((error) => {
                console.error(`이미지 삭제 중 오류가 발생했습니다 (${photoUrl}):`, error);
              });
          });

          await Promise.all(deletePromises);
        }

        // 게시글 삭제 요청
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

useEffect(() => {
  const fetchData = async () => {
    if (board) {
        try {
            const isPostScrapped = await checkScrap(serverUrl, memberEmail, board.id, token, 1);
            setIsScrapped(isPostScrapped);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
  };
  fetchData();
}, [board, serverUrl, memberEmail, token]);

const onScrapHandler = async () => {
  if (!memberEmail) {
    // 로그인하지 않은 상태에서 스크랩을 시도한 경우
    Swal.fire('로그인 후 이용가능합니다');
    return;
  }

  try {
    // 스크랩 처리
    const scrapMessage = await addScrap(serverUrl, memberEmail, id, board.title, token, window.location.href, 1);
    
    // 성공 메시지 및 상태 업데이트
    Swal.fire({
      title: `${scrapMessage}!`,
      icon: '',
      showCancelButton: true,
      confirmButtonColor: '#48088A',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });
    setIsScrapped(prevIsScrapped => !prevIsScrapped);
  } catch (error) {
    // 오류 처리
    Swal.fire('Oops! 잠시 후 다시 시도해 주세요.');
  }
};

  if (!board) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="detail-container">
      {isLoaded ? (
      <div className="detail-post">
        <div className="detail-avatar-container">
          <Avatar
            src={authors[board.author_id]} 
            sx={{ width: 40, height: 40 }}
            className="detail-avatar"
            onClick={()=>navigateToUserProfile(board.author_id)}
          />
          <div className="detail-author" onClick={()=>navigateToUserProfile(board.author_id)}>{board.nickname}</div>
        </div>
        <div className="detail-title-container">
          <div className="detail-title">{board.title}</div>
          <div className="detail-writeday">{board.writeday}</div>
        </div>
        <div className="detail-content-container">
          {board.category === 2 && isLoaded ? (
            <div className="detail-video-container">
              <div className="detail-video-wrapper">
                <video className="detail-video" controls>
                  <source src={medias[board.id]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="detail-video-content">
                <p>{board.content}</p>
              </div>
            </div>
          ) : (
            <>
			<ReactMarkdown 
              	remarkPlugins={[remarkGfm]} 
              	rehypePlugins={[rehypeRaw]}
              	components={{
				    p: ({ node, ...props }) => <p className="detail-content" {...props} />,
				    img: ({ node, ...props }) => <img className="detail-image" {...props} />					  
				  }}
              >
              {board.content}
            </ReactMarkdown>
            </>
          )}
        </div>
        <div className="detail-board-info">
          <div className="left-info">
              <p>
                <Bookmark 
                  color={isScrapped ? 'primary' : 'action'} 
                  onClick={onScrapHandler}
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
        </div>
      </div>) : <BoardDetailSkeleton />}
    </div>
  );
};

export default DetailBoard;
