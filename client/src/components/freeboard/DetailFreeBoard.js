import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../store/BoardSlice';
import DetailBoard from '../board/DetailBoard';
import Repl from '../board/Repl';
import './detailFreeBoard.css';

const DetailFreeBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  
  // 게시물 찾기
  const board = boards.find(b => b.id === parseInt(id) && b.category === 1);

  // useCallback 훅을 사용하여 handleNavigate 함수 최적화
  const handleNavigate = useCallback(() => {
    navigate('/board/freeboard');
  }, [navigate]);

  // 게시물이 없을 경우
  if (!board) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="board-page-top">자유 게시판</div>
      <div className="detail-free-header">
        <button
          className="detail-to-list"
          onClick={handleNavigate}
        >
          자유게시판 목록
        </button>
      </div>
      <div className="detail-free-container">
        <div className="free-detail-container">
          <DetailBoard board={board} />
        </div>
        <div className="free-detail-repl">
          <Repl boardId={board.id} />
        </div>
      </div>
    </>
  );
};

export default DetailFreeBoard;
