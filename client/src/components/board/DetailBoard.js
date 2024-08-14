import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { usePosts } from '../dtboard/PostContext';
import { selectBoardAuthors, selectBoards, selectPageBoardsMedia, likeBoard } from '../../store/BoardSlice';
import Avatar from '@mui/material/Avatar';
import { Favorite, Visibility, Bookmark } from '@mui/icons-material';
import { AuthContext } from '../login/OAuth';
import { jwtDecode } from "jwt-decode";
import './detailBoard.css';
import Swal from 'sweetalert2';
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/firebase';
import BoardDetailSkeleton from '../skeleton/BoardDetailSkeleton';
import useToProfile from '../../hooks/useToProfile';

const DetailBoard = () => {
  const { id } = useParams();
  const { memberEmail, serverUrl, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const boards = useSelector(selectBoards);
  const medias = useSelector(selectPageBoardsMedia);
  const authors = useSelector(selectBoardAuthors);
  const [isLoaded, setIsLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isScrapped, setIsScrapped] = useState(false);
  const [viewIncremented, setViewIncremented] = useState(false);

  const { addScrap, checkScrap } = usePosts();
  const navigateToUserProfile = useToProfile();

  const board = boards.find(b => b.id === parseInt(id, 10));
  const currentViews = board?.views || 0;
  const location = useLocation();
  const [boardData, setBoardData] = useState(location.state?.boardData || null);
  
  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }
  
  
  useEffect(()=>{
    if(!boardData) {
        const newBoardData = boards.find(b => b.id === parseInt(id, 10));
        setBoardData(newBoardData); // 상태 업데이트 함수로 설정
    }
  }, [boardData, id, boards]);  
  
  
  useEffect(() => {
	  const incrementViewCount = async () => {
	    if (viewIncremented || !token) return;
	
	    try {
	      const response = await axios.put(
	          `http://localhost:8080/board/incrementView/${id}`,
	          {},
	          {
	            headers: { "Authorization": `Bearer ${token}` },
	            withCredentials: true,
	          }
	      );
	
	      if (response.data.success) {
	        dispatch({
	          type: 'UPDATE_BOARD_VIEWS',
	          payload: { id: parseInt(id), views: response.data.updatedViewCount }
	        });
	        setViewIncremented(true);
	      }
	    } catch (error) {
	      console.error('Error incrementing view count:', error);
	    }
	  };
    
    if (id && serverUrl && token) {
      incrementViewCount();
    }
  }, [id, serverUrl, token, viewIncremented]);
  


  useEffect(() => {
      const loadData = async () => {
        try {
          const isPostScrapped = await checkScrap(serverUrl, memberEmail, board.id, token, 1);
          setIsScrapped(isPostScrapped);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      loadData();
  }, [board, serverUrl, memberEmail, token, checkScrap]);

  useEffect(() => {
    if (board?.category === 2 && authors && Object.keys(authors).length > 0 && Object.keys(medias).length > 0) {
      setIsLoaded(true);
    } else if (board?.category !== 2 && authors && Object.keys(authors).length > 0) {
      setIsLoaded(true);
    }
  }, [board, authors, medias]);

  useEffect(() => {
    if (board) {
      const path = board.category === 1 ? `/board/freeboard/detail/${id}`
          : board.category === 2 ? `/board/shortform/detail/${id}`
              : board.category === 3 ? `/board/eventboard/detail/${id}`
                  : '/';
      navigate(path);
    }
  }, [board, id, navigate]);

  const handleLike = async () => {
    if (!memberEmail) {
      Swal.fire('로그인 후 이용가능합니다');
      return;
    }
    try {
      await dispatch(likeBoard({ id: board.id, userEmail: memberEmail })).unwrap();
      setLiked(prevLiked => !prevLiked);
    } catch (error) {
      Swal.fire('Oops! 잠시 후 다시 시도해 주세요.');
    }
  };

  const onScrapHandler = async () => {
    if (!memberEmail) {
      Swal.fire('로그인 후 이용가능합니다');
      return;
    }

    try {
      const scrapMessage = await addScrap(serverUrl, memberEmail, id, board.title, token, window.location.href, 1);
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
      Swal.fire('Oops! 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '정말로 삭제하시겠습니까?',
      text: '이 작업은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'black',
      cancelButtonColor: '#darkgray',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    });

    if (result.isConfirmed) {
      try {
        const toBeDeletedImages = extractImageUrls(board.content);
        if (toBeDeletedImages.length > 0) {
          await Promise.all(toBeDeletedImages.map(async (photoUrl) => {
            const imageRef = ref(storage, photoUrl);
            try {
              await deleteObject(imageRef);
              console.log(`이미지가 성공적으로 삭제되었습니다: ${photoUrl}`);
            } catch (error) {
              console.error(`이미지 삭제 중 오류가 발생했습니다 (${photoUrl}):`, error);
            }
          }));
        }

        await axios.delete(`http://localhost:8080/board/delete/${board.id}`);
        console.log('게시물이 삭제되었습니다.');
        await Swal.fire('삭제 완료!', '게시물이 성공적으로 삭제되었습니다.', 'success');

        const path = board.category === 1 ? '/board/freeboard'
            : board.category === 2 ? '/board/shortform'
                : board.category === 3 ? '/board/eventboard'
                    : '/';
        navigate(path);
      } catch (error) {
        console.error('삭제 중 오류가 발생했습니다:', error);
        Swal.fire('삭제 실패', '게시물 삭제 중 문제가 발생했습니다.', 'error');
      }
    }
  };

  const extractImageUrls = (content) => {
    const regex = /!\[.*?\]\((.*?)\)/g;
    return Array.from(content.matchAll(regex), m => m[1]);
  };

  if (!board) return <div>게시물을 찾을 수 없습니다.</div>;
  if (!isLoaded) return <BoardDetailSkeleton />;

  return (
      <div className="detail-container">
        <div className="detail-post">
          <div className="detail-avatar-container">
            <Avatar
                src={authors[board.author_id]}
                sx={{ width: 40, height: 40 }}
                className="detail-avatar"
                onClick={() => navigateToUserProfile(board.author_id)}
            />
            <div className="detail-author" onClick={() => navigateToUserProfile(board.author_id)}>{board.nickname}</div>
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
                      <source src={medias[board.id]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="detail-video-content">
                    <p>{board.content}</p>
                  </div>
                </div>
            ) : (
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
            )}
          </div>
          <div className="detail-board-info">
            <div className="right-info">
              <p>
                <Favorite
                    color={liked ? 'error' : 'action'}
                    onClick={handleLike}
                />
                {liked ? board.like + 1 : board.like}
              </p>
              <p>
                <Visibility />{boardData.views}
              </p>
              <p>
                <Bookmark
                    color={isScrapped ? 'primary' : 'action'}
                    onClick={onScrapHandler}
                    style={{ cursor: 'pointer' }}
                />
              </p>
            </div>
          </div>
          {decodedToken && (decodedToken.email === board.author_id) && (
              <div className="detail-edit-container">
                <button
                    onClick={() => navigate(`/board/${board.category === 1 ? 'freeboard' : board.category === 2 ? 'shortform' : 'eventboard'}/edit/${id}`)}
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
              </div>
          )}
        </div>
      </div>
  );
};

export default DetailBoard;