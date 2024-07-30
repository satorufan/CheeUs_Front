import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NearMeIcon from '@mui/icons-material/NearMe';
import { fetchComments, addComment, deleteComment } from '../../store/CommentSlice';
import { AuthContext } from '../login/OAuth'; // AuthContext 가져오기
import {jwtDecode} from "jwt-decode"; // jwt-decode 패키지 import
import './repl.css';
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';

function Repl({ boardId }) {
    const dispatch = useDispatch();
    const comments = useSelector(state => state.comments.comments[boardId] || []);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const { token } = useContext(AuthContext);
    const userProfile = useSelector(selectUserProfile);

    let decodedToken = {};
    if (token) {
      decodedToken = jwtDecode(token);
    }

    const loggedInUserId = decodedToken?.email;
    const replNickname= userProfile.nickname; // 백에서 닉네임 조인해서 가져와서 다시 처리 해봅시다

    useEffect(() => {
        if (boardId) {
            dispatch(fetchComments(boardId));
        }
    }, [dispatch, boardId]);

    useEffect(() => {
        // console.log('Comments:', comments);
    }, [comments]);

    const handleInputChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleReplyChange = (commentId, e) => {
        setReplyText(prevState => ({
            ...prevState,
            [commentId]: e.target.value,
        }));
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (commentText.trim() !== '') {
            const newComment = {
                board_id: boardId,
                repl_author_id: loggedInUserId, // 로그인한 사용자 ID 사용
                group: 1,
                writeday: new Date().toISOString().split('T')[0],
                repl_content: commentText,
            };
            dispatch(addComment(newComment));
            setCommentText('');
        }
    };

    const handleAddReply = (commentId) => {
        if (replyText[commentId]?.trim() !== '') {
            const reply = {
                board_id: boardId,
                repl_author_id: loggedInUserId, // 로그인한 사용자 ID 사용
                group: 1,
                writeday: new Date().toISOString().split('T')[0],
                repl_content: replyText[commentId],
            };
            dispatch(addComment(reply));
            setReplyText(prevState => ({ ...prevState, [commentId]: '' }));
            setShowReplyInput(prevState => ({ ...prevState, [commentId]: false }));
        }
    };

    const handleDeleteComment = (commentId) => {
        dispatch(deleteComment(commentId));
    };

    const handleDeleteReply = (replyId) => {
        dispatch(deleteComment(replyId));
    };

    const toggleReplyInput = (commentId) => {
        setShowReplyInput(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId],
        }));
    };

    return (
        <div className="detail-comments-container">
            <div className="titlename">댓글</div>
            <form onSubmit={handleAddComment} className="comment-form mb-3">
                <TextField
                    variant="outlined"
                    placeholder="댓글을 남겨주세요..."
                    value={commentText}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={4}
                />
                <button type="submit" className="send-button button-no-style">
                    <NearMeIcon />
                </button>
            </form>

            <div className="detail-comment-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment-container">
                        <div className="detail-comment">
                            <div className="comment-user-info">
                                <img src={'https://via.placeholder.com/30'} alt="Profile" className="reply-profile-pic" />
                                <span className="reply-nickname">{replNickname}</span>
                            </div>
                            <div className="comment-content">
                                <span>{comment.repl_content}</span>
                                {comment.repl_author_id === loggedInUserId && ( // 조건부 렌더링
                                    <button
                                        className="delete-button button-no-style"
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        <DeleteIcon />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="detail-reply-list">
                            {comment.replies && comment.replies.map(reply => (
                                <div key={reply.id} className="reply-container">
                                    <div className="detail-reply">
                                        <div className="reply-user-info">
                                            <img src={'https://via.placeholder.com/30'} alt="Profile" className="reply-profile-pic" />
                                            <span className="reply-nickname">{reply.repl_author_id}</span>
                                        </div>
                                        <div className="reply-content">
                                            <span>{reply.repl_content}</span>
                                            {reply.repl_author_id === loggedInUserId && ( // 조건부 렌더링
                                                <button
                                                    className="delete-button button-no-style"
                                                    onClick={() => handleDeleteReply(reply.id)}
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <span
                                onClick={() => toggleReplyInput(comment.id)}
                                className="reply-arrow"
                                style={{ cursor: 'pointer' }}
                            >
                                {showReplyInput[comment.id] ? '닫기' : '댓글쓰기'}
                            </span>
                        </div>

                        {showReplyInput[comment.id] && (
                            <div className="reply-form">
                                <TextField
                                    variant="outlined"
                                    placeholder="대댓글을 남겨주세요..."
                                    value={replyText[comment.id] || ''}
                                    onChange={(e) => handleReplyChange(comment.id, e)}
                                    fullWidth
                                    multiline
                                    minRows={1}
                                    maxRows={4}
                                />
                                <button
                                    className="send-button button-no-style"
                                    onClick={() => handleAddReply(comment.id)}
                                >
                                    <NearMeIcon />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Repl;