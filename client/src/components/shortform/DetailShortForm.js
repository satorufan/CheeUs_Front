import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../store/BoardSlice';  // 수정 필요
import DetailBoard from '../board/DetailBoard';
import Repl from '../board/Repl';
import './detailShortForm.css';

function DetailShortForm() {
  const { id } = useParams();  // URL에서 파라미터(id)를 가져옴
  const navigate = useNavigate();  // 프로그래밍 방식으로 경로 이동을 제공하는 Hook
  const boards = useSelector(selectBoards);  // Redux의 store에서 boards 데이터를 가져옴

  // 숏폼 게시물 찾기
  const board = boards.find(b => b.id === parseInt(id, 10) && b.category === 2);

  useEffect(() => {
    console.log('ID from URL:', id);
    console.log('Boards from Redux:', boards);
    console.log('Found Board:', board);
  }, [id, boards, board]);

  // 게시물이 없을 경우
  if (!board) {
    return (
      <>
        <div className="board-page-top">숏폼 게시판</div>
        <div className="detail-free-header">
          <button
            className="detail-to-list"
            onClick={() => navigate('/board/shortform')}
          >
            숏폼 게시판 목록
          </button>
        </div>
        <div className="detail-free-container">
          <div className="free-detail-container">
            <div>게시물을 찾을 수 없습니다.</div>
          </div>
        </div>
      </>
    );
  }

  // 게시물이 있는 경우
  return (
    <>
      <div className="board-page-top">숏폼 게시판</div>
      <div className="detail-free-header">
        <button
          className="detail-to-list"
          onClick={() => navigate('/board/shortform')}
        >
          숏폼 게시판 목록
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
}

export default DetailShortForm;
