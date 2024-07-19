import React from 'react';
import { Search } from '@mui/icons-material';

const ChatList = ({ chatRooms, selectedChat, handlePersonClick }) => {
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
                                <img src={`https://www.clarity-enhanced.net/wp-content/uploads/2020/06/profile-${room.member1}.jpg`} alt="" className="rounded-circle mr-3" />
                                <span className="chat-name">{room.member1 !== 101 ? room.member1 : room.member2}</span>
                            </div>
                            <span className="chat-time">2:09 PM</span>
                        </div>
                        <p className="chat-preview mt-1">Preview message</p>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ChatList;
