import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectBoards , fetchBoards } from '../../store/BoardSlice';
import DetailBoard from '../board/DetailBoard';
import Repl from '../board/Repl';
import '../freeboard/detailFreeBoard.css';
import BoardDetailTop from '../board/BoardDetailTop';

const DetailFreeBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBoards('eventboard'));
  }, [dispatch]);
  
  
  // 게시물 찾기
  const board = boards.find(b => b.id === parseInt(id) && b.category === 3);

  // 게시물이 없을 경우
  if (!board) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <>
    <BoardDetailTop category={3} />
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
