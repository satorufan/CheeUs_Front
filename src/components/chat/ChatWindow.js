import React, { useState, useEffect, useContext } from 'react';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import {jwtDecode} from 'jwt-decode'; 
import { AuthContext } from '../login/OAuth';

const ChatWindow = ({
    selectedChat,
    messageInput,
    showMessageInput,
    formatMessageTime,
    scrollRef,
    sendMessage,
    setMessageInput,
}) => {

    const { token } = useContext(AuthContext);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
            } catch (error) {
                console.error('토큰 디코딩 중 에러 발생:', error);
            }
        }
    }, [token]);

    // 메시지가 로그인한 사용자의 것인지 확인하는 함수
    const isSender = (senderId) => senderId === loggedInUserId;

    // 상대방의 아이디를 반환하는 함수
    const getOtherUserId = () => {
        if (!selectedChat) return null;
        return selectedChat.member1 === loggedInUserId ? selectedChat.member2 : selectedChat.member1;
    };

    // 프로필 이미지의 URL을 반환하는 함수
    const getProfileImageSrc = () => {
        if (!selectedChat) return '';
        const profileUserId = getOtherUserId();
        return `https://www.clarity-enhanced.net/wp-content/uploads/2020/06/profile-${profileUserId}.jpg`;
    };

    const [otherUserId, setOtherUserId] = useState(getOtherUserId());

    useEffect(() => {
        setOtherUserId(getOtherUserId());
    }, [selectedChat, loggedInUserId]);

    return (
        <>
            {selectedChat && (
                <>
                    <div className="chat-top">
                        <div className="d-flex align-items-center">
                            <img 
                                src={getProfileImageSrc()} 
                                alt={otherUserId ? `Profile of User ${otherUserId}` : 'Profile'}
                                className="profile-img rounded-circle mr-3"
                            />
                            <span className="chat-name">
                                {otherUserId || 'Loading...'}
                            </span>
                        </div>
                    </div>
                    <div className="chat active-chat" data-chat={`person${selectedChat.roomId}`}>
                        {selectedChat.messages && selectedChat.messages.map((message, index) => (
                            <div
                                key={index}
                                className={`chat-bubble ${isSender(message.sender_id) ? 'me' : 'you'}`}
                            >
                                <div>{message.message}</div>
                                <span className="chat-time">{formatMessageTime(message.write_day)}</span>
                            </div>
                        ))}
                        <div ref={scrollRef}></div>
                    </div>
                    {showMessageInput && (
                        <div className="chat-write d-flex align-items-center">
                            <input
                                type="text"
                                className="form-control flex-grow-1 chat-input"
                                placeholder="Type a message..."
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
            )}
        </>
    );
};

export default ChatWindow;
