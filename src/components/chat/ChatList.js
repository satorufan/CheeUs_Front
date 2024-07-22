import React, { useState, useEffect, useContext } from 'react';
import { Search } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';

const ChatList = ({ chatRooms, selectedChat, handlePersonClick }) => {
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
        console.log('Chat rooms updated:', chatRooms);
    }, [chatRooms]);

    return (
        <>
            <div className="chat-top d-flex align-items-center">
                <input type="text" className="form-control chat-search" placeholder="Search" />
                <Search className="search-icon ml-2" />
            </div>
            <ul className="chat-people list-unstyled">
                {chatRooms.map(room => (
                    <li
                        key={room.roomId}
                        className={`chat-person ${selectedChat && selectedChat.roomId === room.roomId ? 'chat-active' : ''}`}
                        onClick={() => handlePersonClick(room.roomId)}
                    >
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <img 
                                    src={`https://www.clarity-enhanced.net/wp-content/uploads/2020/06/profile-${room.member1}.jpg`} 
                                    alt={`Profile of User ${room.member1}`} 
                                    className="rounded-circle mr-3" 
                                    style={{ width: '40px', height: '40px' }}
                                />
                                <span className="chat-name">{room.member1 !== loggedInUserId ? room.member1 : room.member2}</span>
                            </div>
                            <span className="chat-time">
                                {room.lastMessage ? formatDate(room.lastMessage.write_day) : 'No messages'}
                            </span>
                        </div>
                        <p className="chat-preview mt-1">
                            {room.lastMessage ? room.lastMessage.message : 'No messages'}
                        </p>
                    </li>
                ))}
            </ul>
        </>
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
};

export default ChatList;
