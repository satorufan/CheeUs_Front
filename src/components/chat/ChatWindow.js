import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../login/OAuth';
import { jwtDecode } from 'jwt-decode';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import './chatPage.css';

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
        if (!selectedChat) return 'Loading...';
        return selectedChat.togetherId ? selectedChat.togetherId : getOtherUserId();
    };

    const getDefaultMessage = () => {
        if (activeKey === 'one') {
            return '조용하게 둘이 한 잔?';
        } else {
            return '여럿이 먹는 술이 더 꿀맛!';
        }
    };

    const renderProfileImage = () => {
        if (selectedChat && !selectedChat.togetherId && activeKey === 'one') {
            return (
                <img 
                    src={getProfileImageSrc()} 
                    alt={`Profile of User ${getOtherUserId()}`}
                    className="profile-img rounded-circle mr-3"
                />
            );
        }
        return null;
    };

    if (!selectedChat) {
        return (
            <div className="no-chat">
                {getDefaultMessage()}
            </div>
        );
    }

    return (
        <>
            {activeKey === 'together' || selectedChat ? (
                <>
                    <div className="chat-top">
                        <div className="d-flex align-items-center">
                            {!selectedChat && renderProfileImage()}
                            <span className="chat-name">
                                {getDisplayName()}
                            </span>
                        </div>
                    </div>
                    <div className="chat active-chat" data-chat={`person${selectedChat.roomId}`}>
                        {selectedChat.messages && selectedChat.messages.length > 0 ? (
                            selectedChat.messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`chat-bubble ${isSender(message.sender_id) ? 'me' : 'you'}`}
                                >
                                    <div>{message.message}</div>
                                    <span className="chat-time">{formatMessageTime(message.write_day)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="no-messages">{getDefaultMessage()}</div>
                        )}
                        <div ref={scrollRef}></div>
                    </div>
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
            ) : (
                <div className="no-chat">{getDefaultMessage()}</div>
            )}
        </>
    );
};

export default ChatWindow;