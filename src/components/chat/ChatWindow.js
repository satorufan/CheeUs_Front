import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../login/OAuth';
import {jwtDecode} from 'jwt-decode'; // jwtDecode는 기본 import 사용
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useSelector } from 'react-redux';
import './chatPage.css';
import { selectUserProfile, selectProfiles } from '../../store/MatchSlice';

const ChatWindow = ({
    selectedChat,
    messageInput,
    showMessageInput,
    formatMessageTime,
    scrollRef,
    sendMessage,
    setMessageInput,
    activeKey
}) => {
    const { token } = useContext(AuthContext);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [showParticipants, setShowParticipants] = useState(false);
    const userProfile = useSelector(selectUserProfile);
    const profiles = useSelector(selectProfiles);
    
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
    }, [selectedChat]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const isSender = (senderId) => senderId === loggedInUserId;

    const getOtherUserId = () => {
        if (!selectedChat) return null;
        return selectedChat.member1 === loggedInUserId ? selectedChat.member2 : selectedChat.member1;
    };

    const getProfileImageSrc = () => {
        const profileUserId = getOtherUserId();
        return profileUserId ? `https://www.clarity-enhanced.net/wp-content/uploads/2020/06/profile-${profileUserId}.jpg` : '';
    };

    const getDisplayName = () => {
        if (!selectedChat || (!selectedChat.member1 && !selectedChat.member2 && !selectedChat.togetherId)) {
            return <div className='chat-window-top-no'>나랑 같이 취할 사람 찾으러 가기!</div>; 
        }

        if (selectedChat.togetherId) {
            return (
                <>
                    <div className="chat-name">
                        {selectedChat.togetherId}
                    </div>
                    <div className="participant-list">
                        {selectedChat.members
                            .filter(member => member !== loggedInUserId) 
                            .map((member, index) => (
                                <div key={index} className="participant-item">
                                    <img
                                        src={getProfileImage(member)}
                                        alt={`Profile of ${getNickname(member)}`}
                                        className="participant-img"
                                    />
                                    <div className="participant-info">
                                        <div>{getNickname(member)}</div>
                                    </div>
                                </div>
                            ))}
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
                    />
                    <span>{nickname}</span>
                </div>
            );
        } else {
            return <span>{nickname}</span>;
        }
    };

    const getDefaultMessage = () => {
        if (activeKey === 'one') {
            return '조용하게 둘이 한 잔?';
        } else {
            return '여럿이 먹는 술이 더 꿀맛!';
        }
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
                <div className="chat active-chat" data-chat={`person${selectedChat.roomId}`}>
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
                                            />
                                            <span className="nickname">{senderInfo.nickname}</span>
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
                            <p>{getDefaultMessage()}</p>
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
                            if (e.key === 'Enter') sendMessage();
                        }}
                    />
                    <ArrowUpwardIcon
                        className="send-icon"
                        fontSize="large"
                        onClick={sendMessage}
                    />
                </div>
            )}
        </>
    );
};

export default ChatWindow;
