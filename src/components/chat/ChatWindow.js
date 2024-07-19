import React from 'react';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';

const ChatWindow = ({ selectedChat, messageInput, showMessageInput, formatMessageTime, scrollRef, sendMessage, setMessageInput }) => {
    return (
        <>
            {selectedChat && (
                <>
                    <div className="chat-top">
                        <span>To: <span className="chat-name">{`User ${selectedChat.member1 !== 101 ? selectedChat.member1 : selectedChat.member2}`}</span></span>
                    </div>
                    <div className="chat active-chat" data-chat={`person${selectedChat.roomId}`}>
                        {selectedChat.messages && selectedChat.messages.map((message, index) => (
                            <div key={index} className={`chat-bubble ${message.sender_id === 101 ? 'me' : 'you'}`}>
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
                            <ArrowUpwardIcon className="send-icon" fontSize="large" onClick={sendMessage} />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default ChatWindow;
