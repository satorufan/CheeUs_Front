import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NearMeIcon from '@mui/icons-material/NearMe';
import './repl.css';
import { fetchComments, addComment, deleteComment, fetchCommentsAuthorImg } from '../../store/CommentSlice';
import { AuthContext } from '../login/OAuth';
import { jwtDecode } from "jwt-decode";
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

function Repl({ boardId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const comments = useSelector(state => state.comments.comments[boardId] || []);
    const authorImg = useSelector(state => state.comments.commentAuthorsImg || {});
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const { token } = useContext(AuthContext);
    const userProfile = useSelector(selectUserProfile);
    const [nickname, setNickname] = useState('');
    const [loadingImages, setLoadingImages] = useState(true); // 이미지 로딩 상태

    let decodedToken = {};
    if (token) {
        decodedToken = jwtDecode(token);
    }

    const loggedInUserId = decodedToken?.email;

    useEffect(() => {
        if (boardId) {
            dispatch(fetchComments(boardId));
        }
    }, [dispatch, boardId]);

    useEffect(() => {
        dispatch(fetchCommentsAuthorImg(comments));
        if (userProfile) {
            setNickname(userProfile.profile.nickname);
        }
    }, [comments, userProfile]);

    useEffect(() => {
        if (Object.keys(authorImg).length > 0) {
            setLoadingImages(false); // 이미지 로딩이 완료되면 상태 변경
        }
    }, [authorImg]);

    const handleInputChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleReplyChange = (commentId, e) => {
        setReplyText(prevState => ({
            ...prevState,
            [commentId]: e.target.value,
        }));
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (commentText.trim() !== '') {
            const newComment = {
                board_id: boardId,
                repl_author_id: loggedInUserId,
                nickname: nickname,
                parent_id: 0,
                group: 1,
                writeday: new Date().toISOString().split('T')[0],
                repl_content: commentText,
            };
            await dispatch(addComment(newComment));
            setCommentText('');
            dispatch(fetchComments(boardId));
        }
    };

    const handleAddReply = async (e) => {
        const parentId = parseInt(e.currentTarget.getAttribute('data-parent-id'), 10);
        if (replyText[parentId]?.trim() !== '') {
            const reply = {
                board_id: boardId,
                repl_author_id: loggedInUserId,
                nickname: nickname,
                parent_id: parentId,
                group: 2,
                writeday: new Date().toISOString().split('T')[0],
                repl_content: replyText[parentId],
            };
            await dispatch(addComment(reply));
            setReplyText(prevState => ({ ...prevState, [parentId]: '' }));
            setShowReplyInput(prevState => ({ ...prevState, [parentId]: false }));
            dispatch(fetchComments(boardId));
        }
    };

    const handleDeleteComment = async (commentId) => {
        await dispatch(deleteComment(commentId));
        dispatch(fetchComments(boardId));
    };

    const handleDeleteReply = async (replyId) => {
        await dispatch(deleteComment(replyId));
        dispatch(fetchComments(boardId));
    };

    const toggleReplyInput = (commentId) => {
        setShowReplyInput(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId],
        }));
    };

    const encodeUserInfo = (email) => {
        const secretKey = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_secretKey); 
        const iv = CryptoJS.lib.WordArray.random(16); // 랜덤 IV 생성
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(email), secretKey, { iv: iv }).toString();
        const urlSafeEncryptedData = encryptedData.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const encryptedPayload = {
            iv: iv.toString(CryptoJS.enc.Base64),
            email: urlSafeEncryptedData,
        };
        return encryptedPayload;
    }
    
    const navigateToUserProfile = (email) => {
        if (email) {
            console.log(encodeUserInfo(email));
            navigate(`/userprofile/${encodeUserInfo(email).email}`, {state: encodeUserInfo(email)});
        } else {
            console.error('User ID not found for email:', email);
        }
    };

    const renderComments = (comments) => {
        return comments
            .filter(comment => comment.group === 1)
            .map(comment => (
                <div key={comment.id} className="comment-container">
                    <div className="detail-comment">
                        <div className="comment-user-info">
                            {loadingImages ? (
                                <div className="skeleton skeleton-small" />
                            ) : (
                                <img
                                    src={authorImg[comment.repl_author_id]}
                                    alt="Profile"
                                    className="reply-profile-pic"
                                    onClick={() => navigateToUserProfile(comment.repl_author_id)}
                                />
                            )}
                            <span className="reply-nickname">{comment.nickname}</span>
                        </div>
                        <div className="comment-content">
                            <span>{comment.repl_content}</span>
                            {comment.repl_author_id === loggedInUserId && (
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
                        {comments
                            .filter(reply => reply.group === 2 && reply.parent_id === comment.id)
                            .map(reply => (
                                <div key={reply.id} className="reply-container">
                                    <div className="detail-reply">
                                        <div className="reply-user-info">
                                            {loadingImages ? (
                                                <div className="skeleton-small" />
                                            ) : (
                                                <img
                                                    src={authorImg[reply.repl_author_id]}
                                                    alt="Profile"
                                                    className="reply-profile-pic"
                                                    onClick={() => navigateToUserProfile(reply.repl_author_id)}
                                                />
                                            )}
                                            <span className="reply-nickname">{reply.nickname}</span>
                                        </div>
                                        <div className="reply-content">
                                            <span>{reply.repl_content}</span>
                                            {reply.repl_author_id === loggedInUserId && (
                                                <button
                                                    className="delete-button button-no-style"
                                                    onClick={() => handleDeleteComment(reply.id)}
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
                                data-parent-id={comment.id}
                                onClick={handleAddReply}
                            >
                                <NearMeIcon />
                            </button>
                        </div>
                    )}
                </div>
            ));
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
                {renderComments(comments)}
            </div>
        </div>
    );
}

export default Repl;
