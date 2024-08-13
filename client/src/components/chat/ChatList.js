import React, { useState, useEffect, useContext } from 'react';
import { Search } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, fetchTogetherChatRooms } from '../../store/ChatSlice';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ChatListSkeleton from '../skeleton/ChtListSkeleton';
import useToProfile from '../../hooks/useToProfile';

const ChatList = ({ selectedChat, handlePersonClick, handleExitChat, isTogether }) => {
    const { token, serverUrl } = useContext(AuthContext);
    const [search, setSearch] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    const dispatch = useDispatch();
    const updatedChatRooms = useSelector(state => state.chat.chatRooms);
    const updatedTogetherChatRooms = useSelector(state => state.chat.togetherChatRooms);
    const status = useSelector(state => state.chat.status);
    const error = useSelector(state => state.chat.error);
    const navigateToUserProfile = useToProfile();
    
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
                if (!isTogether) {
                    dispatch(fetchChatRooms({ serverUrl, loggedInUserId: decodedToken.email })).catch(err => {
                        console.error('Failed to fetch chat rooms:', err);
                    });
                } else {
                    dispatch(fetchTogetherChatRooms({ serverUrl, userId: decodedToken.email })).catch(err => {
                        console.error('Failed to fetch together chat rooms:', err);
                    });
                }
            } catch (err) {
                console.error('Token decoding error:', err);
            }
        }
    }, [token, dispatch, isTogether, serverUrl]);

    const formatDate = (dateString) => {
        if (!dateString) return '메시지가 없습니다'; 

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '잘못된 날짜';

        const now = new Date();
        const diff = now - date;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        return `${minutes}분 전`;
    };

    const getLastMessage = (room) => {
        return room.lastMessage || { message: '메시지가 없습니다', write_day: new Date().toISOString(), read: 0 };
    };

    const currentChatRooms = isTogether ? updatedTogetherChatRooms : updatedChatRooms;

    // 검색어를 기준으로 필터링
    const filteredChatRooms = currentChatRooms.filter(room => {
        const nickname = room.nickname ? room.nickname.toLowerCase() : '';
        const togetherId = room.togetherId ? room.togetherId.toLowerCase() : '';
        const searchLower = search.toLowerCase();

        if (isTogether) {
            // 단체 채팅인 경우, nickname과 togetherId로 검색
            return nickname.includes(searchLower) || togetherId.includes(searchLower);
        } else {
            // 1:1 채팅인 경우, nickname만 검색
            return nickname.includes(searchLower);
        }
    });

    const isNewMessage = (room) => {
        const lastMessage = getLastMessage(room);
        if (isTogether) {
            return Array.isArray(lastMessage.read) && !lastMessage.read.includes(loggedInUserId);
        }
        return lastMessage.read === 0 && lastMessage.sender_id !== loggedInUserId;
    };
  

    const isError = status === 'failed';
    const isSuccess = status === 'succeeded';
    const isLoading = status === 'loading';
    const hasChats = filteredChatRooms.length > 0;

    return (
        <>
            <div className="chat-top d-flex align-items-center">
                <input
                    type="text"
                    className="form-control chat-search"
                    placeholder="검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} // 검색어 상태 업데이트
                />
                <Search className="search-icon ml-2" />
            </div>
            {isLoading && (
                <ChatListSkeleton isTogether={isTogether} />
            )}
            {isError && (
                <div className="error-message">
                    <ChatListSkeleton isTogether={isTogether} />
                </div>
            )}
            {isSuccess && hasChats && (
                <ul className="chat-people list-unstyled">
                    {filteredChatRooms.map(room => {
                        const lastMessage = getLastMessage(room);
                        return (
                            <li
                                key={room.roomId}
                                className={`chat-person ${selectedChat && selectedChat.roomId === room.roomId ? 'chat-active' : ''}`}
                                onClick={() => handlePersonClick(room.roomId)}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center" onClick={()=>navigateToUserProfile(room.email)}>
                                        {!isTogether && (
                                            <img
                                                src={room.image || `${process.env.PUBLIC_URL}/images/default-user-icon.png`}
                                                alt={`${room.email}의 프로필`}
                                                className="rounded-circle mr-3"
                                            />
                                        )}
                                        <span className="chat-name">
                                            {room.nickname}
                                        </span>
                                        {isTogether && (
                                            <div className="together-id">
                                                {room.togetherId}
                                            </div>
                                        )}
                                        {isNewMessage(room) && <span className="receive-new">New</span>}
                                    </div>
                                    <span className="chat-time">
                                        {formatDate(lastMessage.write_day)}
                                    </span>
                                </div>
                                <div className="chat-preview">
                                    <div className="message-content">
                                        {lastMessage.message}
                                    </div>
                                    <div className="delete-icon">
                                        <DeleteForeverIcon onClick={() => handleExitChat(room.roomId)} />
                                    </div>
                                    {!hasChats && (
                                        <div className="no-chat-list">
                                            채팅 목록이 없습니다.
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
};

export default ChatList;