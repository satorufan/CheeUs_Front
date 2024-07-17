import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../store/BoardSlice';
import DetailBoard from '../board/DetailBoard';
import Repl from '../board/Repl';
import './detailFreeBoard.css';

const DetailFreeBoard = () => {
  const { id } = useParams();
  const boards = useSelector(selectBoards);
  
  const board = boards.find(b => b.id === parseInt(id) && b.category === 1);

  if (!board) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="detail-free-container">
      <div className="free-detail-container">
        <DetailBoard/>
      </div>
      <div className="free-detail-repl">
        <Repl/>
      </div>
    </div>
  );
};

export default DetailFreeBoard;
