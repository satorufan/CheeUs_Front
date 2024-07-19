import React, { useState } from 'react';
import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NearMeIcon from '@mui/icons-material/NearMe';
import './repl.css';

// 틀만 만든거!!!

function Repl() {
    const [comments, setComments] = useState([]); // 댓글 상태
    const [commentText, setCommentText] = useState(''); // 댓글 입력 텍스트
    const [replyText, setReplyText] = useState({}); // 대댓글 입력 텍스트
    const [showReplyInput, setShowReplyInput] = useState({}); // 대댓글 입력 표시 상태

    // 댓글 입력 변경 핸들러
    const handleInputChange = (e) => {
        setCommentText(e.target.value);
    };

    // 대댓글 입력 변경 핸들러
    const handleReplyChange = (commentIndex, e) => {
        setReplyText({
            ...replyText,
            [commentIndex]: e.target.value,
        });
    };

    // 댓글 추가 핸들러
    const handleAddComment = (e) => {
        e.preventDefault();
        if (commentText.trim() !== '') {
            setComments([
                ...comments,
                { 
                    content: commentText, 
                    replies: [],
                    user: { 
                        profilePic: 'https://via.placeholder.com/30', 
                        nickname: 'User1'  // 가상
                    } 
                }
            ]);
            setCommentText('');
        }
    };

    // 대댓글 추가 핸들러
    const handleAddReply = (commentIndex) => {
        if (replyText[commentIndex]?.trim() !== '') {
            const updatedComments = [...comments];
            updatedComments[commentIndex].replies.push({ 
                content: replyText[commentIndex], 
                user: { 
                    profilePic: 'https://via.placeholder.com/30', 
                    nickname: 'User2' // 가상
                } 
            });
            setComments(updatedComments);
            setReplyText({ ...replyText, [commentIndex]: '' });
            setShowReplyInput({ ...showReplyInput, [commentIndex]: false });
        }
    };

    // 댓글 삭제 핸들러
    const handleDeleteComment = (index) => {
        const updatedComments = comments.filter((_, i) => i !== index);
        setComments(updatedComments);
    };

    // 대댓글 삭제 핸들러
    const handleDeleteReply = (commentIndex, replyIndex) => {
        const updatedComments = [...comments];
        updatedComments[commentIndex].replies = updatedComments[commentIndex].replies.filter((_, i) => i !== replyIndex);
        setComments(updatedComments);
    };

    // 대댓글 입력 토글 핸들러
    const toggleReplyInput = (commentIndex) => {
        setShowReplyInput({
            ...showReplyInput,
            [commentIndex]: !showReplyInput[commentIndex],
        });
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
                {comments.map((comment, commentIndex) => (
                    <div key={commentIndex} className="comment-container">
                        <div className="detail-comment">
                            <div className="comment-user-info">
                                <img src={comment.user.profilePic} alt="Profile" className="reply-profile-pic" />
                                <span className="reply-nickname">{comment.user.nickname}</span>
                            </div>
                            <div className="comment-content">
                                <span>{comment.content}</span>
                                <button 
                                    className="delete-button button-no-style"
                                    onClick={() => handleDeleteComment(commentIndex)}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>

                        <div className="detail-reply-list">
                            {comment.replies.map((reply, replyIndex) => (
                                <div key={replyIndex} className="detail-reply">
                                    <div className="comment-user-info">
                                        <img src={reply.user.profilePic} alt="Profile" className="reply-profile-pic" />
                                        <span className="reply-nickname">{reply.user.nickname}</span>
                                    </div>
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

                        <div style={{ textAlign: 'right' }}>
                            {!showReplyInput[commentIndex] && (
                                <span
                                    onClick={() => toggleReplyInput(commentIndex)}
                                    className="reply-arrow"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {comment.replies.length === 0 ? '댓글쓰기' : '댓글쓰기'}
                                </span>
                            )}
                        </div>

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
                                    onClick={() => handleAddReply(commentIndex)}
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
