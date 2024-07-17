import React, { useState } from 'react';
import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NearMeIcon from '@mui/icons-material/NearMe';
import './repl.css';

function Repl() {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});

    const handleInputChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleReplyChange = (commentIndex, e) => {
        setReplyText({
            ...replyText,
            [commentIndex]: e.target.value,
        });
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (commentText.trim() !== '') {
            setComments([...comments, { content: commentText, replies: [] }]);
            setCommentText('');
        }
    };

    const handleAddReply = (commentIndex) => {
        if (replyText[commentIndex]?.trim() !== '') {
            const updatedComments = [...comments];
            updatedComments[commentIndex].replies.push({ content: replyText[commentIndex] });
            setComments(updatedComments);
            setReplyText({ ...replyText, [commentIndex]: '' });
            setShowReplyInput({ ...showReplyInput, [commentIndex]: false });
        }
    };

    const handleDeleteComment = (index) => {
        const updatedComments = comments.filter((_, i) => i !== index);
        setComments(updatedComments);
    };

    const handleDeleteReply = (commentIndex, replyIndex) => {
        const updatedComments = [...comments];
        updatedComments[commentIndex].replies = updatedComments[commentIndex].replies.filter((_, i) => i !== replyIndex);
        setComments(updatedComments);
    };

    const toggleReplyInput = (commentIndex) => {
        setShowReplyInput({
            ...showReplyInput,
            [commentIndex]: !showReplyInput[commentIndex],
        });
    };

    return (
        <div className="detail-comments-container">
            <h5 className="mt-4">댓글</h5>
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
                {comments.map((comment, commentIndex) => (
                    <div key={commentIndex} className="comment-container">
                        <div className="detail-comment">
                            <div className="comment-content">
                                <span>{comment.content}</span>
                                <button
                                    className="delete-button button-no-style"
                                    onClick={() => handleDeleteComment(commentIndex)}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                            
                            {/* "댓글쓰기" 버튼 */}
                            <div style={{ textAlign: 'right' }}>
                                {!showReplyInput[commentIndex] && (
                                    <span
                                        onClick={() => toggleReplyInput(commentIndex)}
                                        className="reply-arrow"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        댓글쓰기
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="detail-reply-list">
                            {comment.replies.map((reply, replyIndex) => (
                                <div key={replyIndex} className="detail-reply">
                                    <div className="comment-content">
                                        <span>{reply.content}</span>
                                        <button
                                            className="delete-button button-no-style"
                                            onClick={() => handleDeleteReply(commentIndex, replyIndex)}
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 대댓글 입력 폼 */}
                        {showReplyInput[commentIndex] && (
                            <div className="reply-form">
                                <TextField
                                    variant="outlined"
                                    placeholder="대댓글을 남겨주세요..."
                                    value={replyText[commentIndex] || ''}
                                    onChange={(e) => handleReplyChange(commentIndex, e)}
                                    fullWidth
                                    multiline
                                    minRows={1}
                                    maxRows={4}
                                />
                                <button
                                    className="send-button button-no-style"
                                    onClick={() => {
                                        handleAddReply(commentIndex);
                                    }}
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
