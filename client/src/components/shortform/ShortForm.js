import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import PushPinIcon from '@mui/icons-material/PushPin';
import Chip from '@mui/material/Chip';
import BoardTop from '../board/BoardTop';
import Pagination from '@mui/material/Pagination';
import { selectBoards, toggleLike, selectLikedMap, filterBoards, setSearchQuery, selectFilteredBoards, fetchBoards, fetchBoardsMedia, selectPageBoardsMedia, fetchBoardsAuthor, selectBoardAuthors} from '../../store/BoardSlice';
import './shortForm.css';
import ShortformSkeleton from '../skeleton/ShortformSkeleon.js';

const ShortForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const boards = useSelector(selectBoards);
  const likedMap = useSelector(selectLikedMap);
  const filteredBoards = useSelector(selectFilteredBoards);
  const medias = useSelector(selectPageBoardsMedia);
  const authors = useSelector(selectBoardAuthors);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (medias && Object.keys(medias).length > 0) {
      setIsLoaded(true);
    }
  }, [medias, boards]);
  console.log(isLoaded, medias);
  const searchQuery = useSelector(state => state.board.searchQuery);

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredBoard, setHoveredBoard] = useState(null);
  const boardRefs = useRef({});

  // 보드 목록 로딩
  useEffect(() => {
    dispatch(fetchBoards('shortform'));
  }, [dispatch]);

  // URL 쿼리에서 검색어를 읽어와 상태에 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    dispatch(setSearchQuery(query)); // 검색어를 상태에 설정
    dispatch(filterBoards()); // 검색어에 따라 필터링
  }, [location.search, dispatch]);

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

  // 페이지네이션
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleBoards = filteredBoards.filter(board => !board.hidden);
  const pinnedBoards = visibleBoards.filter(board => board.category === 2 && board.pinned);
  const regularBoards = visibleBoards.filter(board => board.category === 2 && !board.pinned);
  const currentBoards = [...pinnedBoards, ...regularBoards].slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(visibleBoards.filter(board => board.category === 2).length / itemsPerPage);

  function arraysEqualAsSets(arr1, arr2) {
    return new Set(arr1).size === new Set([...arr1, ...arr2]).size;
  }
  
  const perPageAuthors = [];
  currentBoards.map(board => {
    if (!perPageAuthors.includes(board.author_id)) perPageAuthors.push(board.author_id);
  });

  useEffect(() => {
    if (currentBoards.length > 0 && (!arraysEqualAsSets(Object.keys(authors), perPageAuthors) || medias.length == 0)) {
      dispatch(fetchBoardsMedia({category: 'shortform', perPageBoards: currentBoards}));
      dispatch(fetchBoardsAuthor({category: 'eventboard', perPageBoards: currentBoards}));
    }
  }, [dispatch, currentBoards, perPageAuthors]);

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
      boardRefs.current[medias[board.id]] = document.getElementById(medias[board.id]);
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
          {arraysEqualAsSets(Object.keys(authors), perPageAuthors) ? currentBoards.map((board) => (
            board.category === 2 && ( // 카테고리가 2인 경우에만 렌더링
              <Card
                key={board.id}
                variant="plain"
                className="video-card"
                onMouseEnter={() => handleMouseEnter(medias[board.id])}
                onMouseLeave={() => handleMouseLeave(medias[board.id])}
                onClick={() => handleCardClick(board.id)}
              >
              {board.pinned && (
                <Box className="pinned-icon-container">
                  <PushPinIcon className="pinned-icon" />
                  <Chip label="공지" size="small" className="notice-chip" />
                </Box>
              )}                 
                <Box className="card-video">
                  <AspectRatio ratio="2/4">
                    <CardCover className="card-cover">
                      <video
                        id={medias[board.id]}
                        loop
                        muted
                        ref={el => boardRefs.current[medias[board.id]] = el}
                        className="card-video video-element"
                        autoPlay={hoveredBoard === medias[board.id]}
                      >
                        <source
                          src={medias[board.id]}
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
                    src={authors[board.author_id]}
                    size="sm"
                    sx={{ '--Avatar-size': '1.5rem' }}
                    className="card-avatar"
                  />
                  <div>
                    <div className='short-author'>
                      {board.nickname}
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
          )) : <ShortformSkeleton />}
        </div>
      </div>
      <div className="create-post-container">
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