import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../store/BoardSlice';
import DetailBoard from '../board/DetailBoard';

const DetailFreeBoard = () => {
  const { id } = useParams();
  const boards = useSelector(selectBoards);
  
  const board = boards.find(b => b.id === parseInt(id) && b.category === 1);

  if (!board) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="detail-container">
      <DetailBoard/>
    </div>
  );
};

export default DetailFreeBoard;
