import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Search } from '@mui/icons-material';
import {jwtDecode} from 'jwt-decode';
import { AuthContext } from '../login/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, fetchTogetherChatRooms, updateOneOnOneChatRoomStatus, removeUserFromTogetherChatRoom } from '../../store/ChatSlice';
import { selectUserProfile, fetchUserProfiles, selectProfiles } from '../../store/MatchSlice';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const ChatList = ({ selectedChat, handlePersonClick, isTogether }) => {
    const { token, serverUrl, memberEmail } = useContext(AuthContext);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const dispatch = useDispatch();
    const updatedChatRooms = useSelector(state => state.chat.chatRooms);
    const updatedTogetherChatRooms = useSelector(state => state.chat.togetherChatRooms);
    const status = useSelector(state => state.chat.status);
    const error = useSelector(state => state.chat.error);
    const userProfile = useSelector(selectUserProfile);
    // const profiles = useSelector(selectProfiles);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
                dispatch(fetchChatRooms({serverUrl, userId : decodedToken.email})).catch(err => {
                    console.error('Failed to fetch chat rooms:', err);
                });
                dispatch(fetchTogetherChatRooms()).catch(err => {
                    console.error('Failed to fetch together chat rooms:', err);
                });
                dispatch(fetchUserProfiles({ serverUrl, memberEmail })).catch(err => {
                    console.error('Failed to fetch user profiles:', err);
                });
            } catch (err) {
                console.error('Token decoding error:', err);
            }
        }
    }, [token, dispatch]);

    useEffect(() => {
        console.log('업데이트된 1:1 채팅방:', updatedChatRooms);
        console.log('업데이트된 단체 채팅방:', updatedTogetherChatRooms);
        console.log(userProfile);
    }, [updatedChatRooms, updatedTogetherChatRooms, userProfile]);

    // const getProfileImage = useCallback((memberId) => {
    //     console.log(profiles);
    //     const profile = profiles.find(p => p.profile.email === memberId);
    //     return profile && profile.imageBlob.length > 0 
    //         ? profile.imageBlob[0] 
    //         : 'https://www.example.com/default-profile.jpg'; // 기본 이미지 URL
    // }, [profiles]);

    // const getOtherMemberId = (room) => {
    //     if (isTogether) {
    //         return room.members.find(member => member !== loggedInUserId);
    //     }
    //     return room.member1 === loggedInUserId ? room.member2 : room.member1;
    // };

    
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

    const isUserInChat = (room) => {
        if (!isTogether) {
            return room.match !== 3;
        }
        return room.members.includes(loggedInUserId);
    };

    // const getNickname = (email) => {
    //     const profile = profiles.find(p => p.profile.email === email);
    //     return profile ? profile.profile.nickname : email;
    // };

    const currentChatRooms = isTogether ? updatedTogetherChatRooms : updatedChatRooms;

    if (status === 'loading') {
        return <div>로딩 중...</div>;
    }

    if (status === 'failed') {
        return <div>오류 발생: {error}</div>;
    }

    const handleExitChat = (roomId) => { // 여기 해결하기
        if (isTogether) {
            if (window.confirm('정말로 이 단체 채팅방에서 나가시겠습니까?')) {
                dispatch(removeUserFromTogetherChatRoom({ roomId, userId: loggedInUserId }))
                    .then(() => console.log('단체 채팅방에서 사용자 제거 성공'))
                    .catch(err => console.error('단체 채팅방에서 사용자 제거 오류:', err));
            }
        } else {
            if (window.confirm('정말로 이 1:1 채팅방을 삭제하시겠습니까?')) {
                dispatch(updateOneOnOneChatRoomStatus({ roomId, match: 3 }))
                    .then(() => console.log('1:1 채팅방 match 업데이트 성공'))
                    .catch(err => console.error('1:1 채팅방 match 업데이트 오류:', err));
            }
        }
    };

    return (
        <>
            <div className="chat-top d-flex align-items-center">
                <input type="text" className="form-control chat-search" placeholder="검색" />
                <Search className="search-icon ml-2" />
            </div>
            <ul className="chat-people list-unstyled">
                {currentChatRooms && currentChatRooms.length > 0 ? (
                    currentChatRooms.filter(isUserInChat).map(room => {
                        const lastMessage = getLastMessage(room);
                        const isNewMessage = lastMessage.read === 0;
                        // const otherMemberId = getOtherMemberId(room);
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
                                        {isNewMessage && lastMessage.sender_id !== loggedInUserId && <span className="receive-new">New</span>}
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
                    <li className="no-messages">채팅이 없습니다</li>
                )}
            </ul>
        </>
    );
};

export default ChatList;