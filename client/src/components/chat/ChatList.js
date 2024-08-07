import React, { useState, useEffect, useContext } from 'react';
import { Search } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, fetchTogetherChatRooms, updateOneOnOneChatRoomStatus, removeUserFromTogetherChatRoom } from '../../store/ChatSlice';
import { selectUserProfile, fetchUserProfiles, selectProfiles } from '../../store/MatchSlice';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ChatListSkeleton from '../skeleton/ChtListSkeleton'; 

const ChatList = ({ selectedChat, handlePersonClick, isTogether }) => {
    const { token, serverUrl, memberEmail } = useContext(AuthContext);
    const [search, setSearch] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false); // 데이터 로딩 완료 상태

    const dispatch = useDispatch();
    const updatedChatRooms = useSelector(state => state.chat.chatRooms);
    const updatedTogetherChatRooms = useSelector(state => state.chat.togetherChatRooms);
    const status = useSelector(state => state.chat.status);

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
                dispatch(fetchUserProfiles({ serverUrl, memberEmail })).catch(err => {
                    console.error('Failed to fetch user profiles:', err);
                });
            } catch (err) {
                console.error('Token decoding error:', err);
            }
        }
    }, [token, dispatch, isTogether, serverUrl, memberEmail]);

    useEffect(() => {
        if (status !== 'loading') {
            setDataLoaded(true); // 데이터 로딩 완료 상태 업데이트
        }
    }, [status]);

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
        console.log(lastMessage);
        if (isTogether) {
            return !(lastMessage.read ?. includes(loggedInUserId));
        }
        return lastMessage.read === 0 && lastMessage.sender_id !== loggedInUserId;
    };

    const handleExitChat = (roomId) => {
        if (isTogether) {
            if (window.confirm('정말로 이 단체 채팅방에서 나가시겠습니까?')) {
                dispatch(removeUserFromTogetherChatRoom({ roomId, userId: loggedInUserId }))
                    .then(() => {
                        dispatch(fetchTogetherChatRooms({ serverUrl, userId: loggedInUserId }));
                    })
                    .catch(err => console.error('단체 채팅방에서 사용자 제거 오류:', err));
            }
        } else {
            if (window.confirm('정말로 이 1:1 채팅방을 삭제하시겠습니까?')) {
                dispatch(updateOneOnOneChatRoomStatus({ roomId, match: 3 }))
                    .then(() => {
                        dispatch(fetchChatRooms({ serverUrl, userId: loggedInUserId }));
                    })
                    .catch(err => console.error('1:1 채팅방 match 업데이트 오류:', err));
            }
        }
    };

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
            {status === 'loading' ? (
                <ChatListSkeleton isTogether={isTogether} />
            ) : (
                <ul className="chat-people list-unstyled">
                    {dataLoaded ? (
                        filteredChatRooms.length > 0 ? ( 
                            filteredChatRooms.map(room => {
                                const lastMessage = getLastMessage(room);
                                return (
                                    <li
                                        key={room.roomId}
                                        className={`chat-person ${selectedChat && selectedChat.roomId === room.roomId ? 'chat-active' : ''}`}
                                        onClick={() => handlePersonClick(room.roomId)}
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                {!isTogether && (
                                                    <img
                                                        src={room.image}
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
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="no-chat-list">채팅이 없습니다</li>
                        )
                    ) : null}
                </ul>
            )}
        </>
    );
};

export default ChatList;
