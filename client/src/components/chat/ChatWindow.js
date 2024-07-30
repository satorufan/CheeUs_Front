import React, { useEffect, useContext, useState, useRef } from 'react';
import { AuthContext } from '../login/OAuth';
import {jwtDecode} from 'jwt-decode';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useSelector } from 'react-redux';
import './chatPage.css';
import { selectProfiles } from '../../store/MatchSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ChatWindow = ({
    selectedChat,
    messageInput,
    showMessageInput,
    formatMessageTime,
    sendMessage,
    setMessageInput,
    activeKey
}) => {
    const { token } = useContext(AuthContext);
    const scrollRef = useRef(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [showParticipants, setShowParticipants] = useState(false);
    const profiles = useSelector(selectProfiles);
    const navigate = useNavigate(); 

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
            } catch (error) {
                console.error('토큰 디코딩 에러:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        if (selectedChat) {
            scrollToBottom();
        }
    }, [selectedChat, selectedChat?.messages]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            const element = scrollRef.current;
            const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

            if (!isAtBottom) {
                element.scrollTo({
                    top: element.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    };

    const isAdmin = () => {
        return selectedChat && selectedChat.members.length > 0 && selectedChat.members[0] === loggedInUserId;
    };

    const isSender = (senderId) => senderId === loggedInUserId;

    const getOtherUserId = () => {
        if (!selectedChat) return null;
        return selectedChat.member1 === loggedInUserId ? selectedChat.member2 : selectedChat.member1;
    };

    const getDisplayName = () => {
        if (!selectedChat || (!selectedChat.member1 && !selectedChat.member2 && !selectedChat.togetherId)) {
            return <div className='chat-window-top-no'>나랑 같이 취할 사람 찾으러 가기!</div>; 
        }
    
        if (selectedChat.togetherId) {
            const nonCurrentMembers = selectedChat.members.filter(member => member !== loggedInUserId);
            const avatarsToShow = nonCurrentMembers.slice(0, 1); 
            const additionalCount = nonCurrentMembers.length - 1; 
    
            return (
                <>
                    <div className="chat-name">
                        {selectedChat.togetherId}
                    </div>
                    <div className="participant-list">
                        <div className="participant-avatar-container">
                            {avatarsToShow.map((member, index) => (
                                <div
                                    key={index}
                                    className="participant-item"
                                    style={{ zIndex: avatarsToShow.length - index }}
                                >
                                    <img
                                        src={getProfileImage(member)}
                                        alt={`Profile of ${getNickname(member)}`}
                                        className="participant-img"
                                    />
                                </div>
                            ))}
                            {additionalCount > 0 && (
                                <div className="more-avatars">
                                     + {additionalCount}
                                </div>
                            )}
                        </div>
                        <button className="more" onClick={toggleParticipants}>
                            <MoreVertIcon />
                        </button>
                    </div>
                </>
            );
        }
    
        const otherUserId = getOtherUserId();
        if (!otherUserId) {
            return <span>상대방 정보 없음</span>;
        }
        
        const nickname = getNickname(otherUserId);
        const profileImage = getProfileImage(otherUserId);
    
        if (activeKey === 'one') {
            return (
                <div className="d-flex align-items-center">
                    <img 
                        src={profileImage} 
                        alt={`Profile of ${nickname}`} 
                        className="profile-img rounded-circle" 
                        style={{ width: '40px', height: '40px', marginRight: '10px' }}
                        onClick={() => navigateToUserProfile(otherUserId)}
                    />
                    <span onClick={() => navigateToUserProfile(otherUserId)}>{nickname}</span> 
                </div>
            );
        } else {
            return <span onClick={() => navigateToUserProfile(otherUserId)}>{nickname}</span>; 
        }
    };

    const getDefaultMessage = () => {
        if (activeKey === 'one') {
            return ['조용하게', '둘이 한 잔?'];
        } else {
            return ['여럿이 먹는 술이', '더 꿀맛!'];
        }
    };
    
    const DefaultMessage = () => {
        const [line1, line2] = getDefaultMessage();
        return (
            <div>
                <>{line1}</>
                <br />
                <>{line2}</>
            </div>
        );
    };

    const toggleParticipants = () => {
        setShowParticipants(!showParticipants);
    };

    const getNickname = (email) => {
        const profile = profiles.find(p => p.profile.email === email);
        return profile ? profile.profile.nickname : email;
    };

    const getProfileImage = (email) => {
        const profile = profiles.find(p => p.profile.email === email);
        return profile && profile.imageBlob.length > 0
            ? profile.imageBlob[0]
            : 'https://www.example.com/default-profile.jpg';
    };

    const getUserId = (email) => {
        const profile = profiles.find(p => p.profile.email === email);
        return profile ? profile.profile.id : null;
    };

    const navigateToUserProfile = (email) => {
        const userId = getUserId(email);
        if (userId) {
            navigate(`/user/${userId}`);
        } else {
            console.error('User ID not found for email:', email);
        }
    };

    const getMessageSenderInfo = (senderId) => {
        const senderProfile = profiles.find(p => p.profile.email === senderId);
        return {
            nickname: senderProfile ? senderProfile.profile.nickname : senderId,
            profileImage: senderProfile && senderProfile.imageBlob.length > 0
                ? senderProfile.imageBlob[0]
                : 'https://www.example.com/default-profile.jpg'
        };
    };

    const getChatBubbleClasses = (senderId) => {
        return isSender(senderId) ? 'chat-bubble me' : 'chat-bubble you';
    };

    const handleKick = (memberId) => {
        console.log('Kick user:', memberId);
        // 추가 구현예정
    };

    const handleReport = (memberId) => {
        console.log('Report user:', memberId);
        // 추가 구현예정
    };

    return (
        <>
            <div className="chat-window-top">
                {selectedChat || activeKey === 'together' ? (
                    <div className="top-bar">
                        {getDisplayName()}
                    </div>
                ) : (
                    <div className="default-message">
                        <p className="chat-window-top-no">나랑 같이 취할 사람 찾으러 가기!</p>
                    </div>
                )}
            </div>

            {selectedChat && (
                <div className="chat active-chat" data-chat={`person${selectedChat.roomId}`} ref={scrollRef}>
                    {selectedChat.messages && selectedChat.messages.length > 0 ? (
                        selectedChat.messages.map((message, index) => {
                            const senderInfo = getMessageSenderInfo(message.sender_id);
                            const isSameSenderAsPrevious = index > 0 && selectedChat.messages[index - 1].sender_id === message.sender_id;
                            return (
                                <div
                                    key={index}
                                    className={`chat-bubble-container ${isSender(message.sender_id) ? 'me' : 'you'}`}
                                >
                                    {!isSender(message.sender_id) && !isSameSenderAsPrevious && (
                                        <div className="message-info">
                                            <img
                                                src={senderInfo.profileImage}
                                                alt={`Profile of ${senderInfo.nickname}`}
                                                className="profile-img rounded-circle"
                                                onClick={() => navigateToUserProfile(message.sender_id)}
                                            />
                                            <span className="nickname" onClick={() => navigateToUserProfile(message.sender_id)}>{senderInfo.nickname}</span> 
                                        </div>
                                    )}
                                    <div className={getChatBubbleClasses(message.sender_id)}>
                                        {message.message}
                                    </div>
                                    <span className="chat-time">{formatMessageTime(message.write_day)}</span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-messages">
                            <div>{DefaultMessage()}</div>
                        </div>
                    )}
                    <div ref={scrollRef}></div>
                </div>
            )}

            {showMessageInput && (
                <div className="chat-write d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control flex-grow-1 chat-input"
                        placeholder="메시지를 입력하세요..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                                scrollToBottom();
                            }
                        }}
                    />
                    <ArrowUpwardIcon
                        className="send-icon"
                        fontSize="large"
                        onClick={() => {
                            sendMessage();
                            scrollToBottom();
                        }}
                    />
                </div>
            )}

            {/* 채팅 참여자 모달 */}
            <Modal show={showParticipants} onHide={toggleParticipants}>
                <Modal.Header closeButton>
                    <Modal.Title>채팅 참여자</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedChat && selectedChat.members ? (
                        <ul className="participant-modal-list">
                            {selectedChat.members.map((member, index) => (
                                <li key={index} className="participant-modal-item">
                                    <img
                                        src={getProfileImage(member)}
                                        alt={`Profile of ${getNickname(member)}`}
                                        className="participant-modal-img"
                                        onClick={() => navigateToUserProfile(member)}
                                    />
                                    <span
                                        className="modal-nickname"
                                        onClick={() => navigateToUserProfile(member)} 
                                    >
                                        {getNickname(member)}
                                    </span>
                                    <div className="participant-modal-actions">
                                        {isAdmin() && ( 
                                            <button className="no-style" onClick={() => handleKick(member)}>강퇴</button>
                                        )}
                                        <button className="no-style" onClick={() => handleReport(member)}>🚨</button>
                                    </div>
                                    <br/>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No participants found.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleParticipants}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChatWindow;