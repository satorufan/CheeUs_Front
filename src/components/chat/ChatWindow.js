import React, { useState, useEffect, useContext } from 'react';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
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

    useEffect(() => {
        scrollToBottom();
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

    return (
        <>
            {selectedChat ? (
                <>
                    <div className="chat-top">
                        <div className="d-flex align-items-center">
                            {!selectedChat.togetherId && (
                                <img 
                                    src={getProfileImageSrc()} 
                                    alt={`Profile of User ${getOtherUserId()}`}
                                    className="profile-img rounded-circle mr-3"
                                />
                            )}
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
                            <div className="no-messages">채팅방을 선택하세요</div>
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
                <div>채팅방을 선택하세요.</div>
            )}
        </>
    );
};

export default ChatWindow;
