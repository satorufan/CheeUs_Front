import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBoards } from '../../store/BoardSlice';
import './detailBoard.css'; 
import Avatar from '@mui/material/Avatar';
import { Button, Form } from 'react-bootstrap'; // Import Bootstrap components

const DetailBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);
  
  const board = boards.find(b => b.id === parseInt(id));
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!board) {
      return; 
    }
    
    // Redirect based on category
    if (board.category === 1) {
      navigate(`/board/freeboard/detail/${id}`);
    } else if (board.category === 2) {
      navigate(`/board/shortform/detail/${id}`);
    } else if (board.category === 3) {
      navigate(`/board/event/detail/${id}`);
    }
  }, [board, id, navigate]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText('');
    }
  };

  if (!board) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="detail-container">
      {/* Post Details Section */}
      <div className="detail-post">
        <div className="detail-avatar-container">
          <Avatar
            src={board.author_photo} 
            sx={{ width: 40, height: 40 }}
            className="detail-avatar"
          />
          <div className="detail-author">{board.author_name}</div>
        </div>
        <div className="detail-title-container">
          <div className="detail-title">{board.title}</div>
          <div className="detail-writeday">{board.writeday}</div>
        </div>
        <div className="detail-content-container">
          <p className="detail-content">{board.content}</p>
        </div>
        {board.photoes && (
          <div className="detail-image-container">
            <img className="detail-image" src={board.photoes} alt={board.title} />
          </div>
        )}
        <div className="detail-board-info">
          <p>조회수: {board.views}</p>
          <p>좋아요: {board.like}</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate(`/board/edit/${id}`)}
          className="mt-3"
        >
          수정하기
        </Button>
      </div>

      {/* Comments Section */}
      <div className="detail-comments-container">
        <h5 className="mt-4">댓글</h5>
        <Form onSubmit={handleAddComment} className="mb-3">
          <Form.Group controlId="comment">
            <Form.Control 
              type="text" 
              placeholder="댓글을 남겨주세요..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" type="submit">
            댓글 추가
          </Button>
        </Form>

        <div className="detail-comment-list">
          {comments.map((comment, index) => (
            <div key={index} className="detail-comment">
              {comment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailBoard;
