import React, { useState, useEffect } from 'react';
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
import {selectBoards, toggleLike, selectLikedMap, filterBoards, setSearchQuery, selectFilteredBoards, fetchBoards, selectBoardAuthors, fetchBoardsAuthor} from '../../store/BoardSlice';
import Pagination from '@mui/material/Pagination';
import './freeBoard.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import BoardSkeleton from '../skeleton/BoardSkeleton';

const FreeBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const boards = useSelector(selectBoards);
  const authors = useSelector(selectBoardAuthors);
  const [isLoaded, setIsLoaded] = useState(false);
  console.log(authors);
  const likedMap = useSelector(selectLikedMap);
  const filteredBoards = useSelector(selectFilteredBoards);
  
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // 보드 목록 로딩
  useEffect(() => {
      dispatch(fetchBoards('freeboard'));
  }, [dispatch]);

  // URL 쿼리에서 검색어를 읽어와 상태에 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    dispatch(setSearchQuery(query)); // 검색어를 상태에 설정
    dispatch(filterBoards()); // 검색어에 따라 필터링
  }, [location.search, dispatch]);

  useEffect(() => {
    console.log('Filtered Boards:', filteredBoards);
  }, [filteredBoards]);

  const handleLikeClick = (id) => {
    dispatch(toggleLike(id));
  };

  const handleCardClick = (id) => {
    navigate(`/board/freeboard/detail/${id}`);
  };

  const handleCreatePost = () => {
    navigate('/board/freeboard/write');
  };

  // 페이지네이션
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleBoards = filteredBoards.filter(board => !board.hidden);
  const pinnedBoards = visibleBoards.filter(board => board.category === 1 && board.pinned);
  const regularBoards = visibleBoards.filter(board => board.category === 1 && !board.pinned);
  const currentBoards = [...pinnedBoards, ...regularBoards].slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(visibleBoards.filter(board => board.category === 1).length / itemsPerPage);
  console.log(currentBoards);
  function arraysEqualAsSets(arr1, arr2) {
    return new Set(arr1).size === new Set([...arr1, ...arr2]).size;
  }

  const perPageAuthors = [];
  currentBoards?.map(board => {
    if (!perPageAuthors.includes(board.author_id)) perPageAuthors.push(board.author_id);
  });

  useEffect(() => {
    if (currentBoards.length > 0 && !arraysEqualAsSets(Object.keys(authors), perPageAuthors)) {
      dispatch(fetchBoardsAuthor({category: 'freeboard', perPageBoards: currentBoards}));
    }
  }, [dispatch, currentBoards, boards]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <BoardTop />
      <div className="freeboard-container">
        <div className="freeboard-card-container">
          {arraysEqualAsSets(Object.keys(authors), perPageAuthors) ? currentBoards.map((board) => (
            <Card
              key={board.id}
              variant="plain"
              className="freeboard-card"
              onClick={() => handleCardClick(board.id)}
            >
              {board.pinned && (
                <Box className="pinned-icon-container">
                  <PushPinIcon className="pinned-icon" />
                  <Chip label="공지" size="small" className="notice-chip" />
                </Box>
              )}            
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
                      <div className="content-text">
                       <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {board.content}
                        </ReactMarkdown>
                      </div>
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
                  src={authors[board.author_id]}
                  size="sm"
                  sx={{ '--Avatar-size': '1.5rem' }}
                  className="card-avatar"
                />
                <div>
                  <div className="card-author-name">
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
          )) : <BoardSkeleton />}
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

export default FreeBoard;