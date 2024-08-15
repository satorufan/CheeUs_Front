import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 초기 상태 정의
const initialState = {
    selectedChat: null,
    chatRooms: [],
    togetherChatRooms: [],
    messageInput: '',
    showMessageInput: false,
    activeKey: 'one',
    status: 'idle',
    error: null,
    unreadMessages: {},
};

// 1:1 채팅방을 가져오는 비동기 Thunk
export const fetchChatRooms = createAsyncThunk(
    'chat/fetchChatRooms',
    async ({ serverUrl, loggedInUserId }) => {
        try {
            const response = await axios.get('http://localhost:8889/api/chatRooms');
            const chatRooms = response.data.filter(room => room.match === 2 && (room.member1 === loggedInUserId || room.member2 === loggedInUserId));

            const chatRoomsWithMessages = await Promise.all(chatRooms.map(async (room) => {
                const messagesResponse = await axios.get(`http://localhost:8889/api/messages/${room.roomId}`);
                const messages = messagesResponse.data;
                const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

                const userInfo = await axios.get(serverUrl + '/match/chattingPersonal', {
                    params: {
                        email: room.member1 === loggedInUserId ? room.member2 : room.member1
                    }
                }).catch((err)=>{
                    if (err.response.data.message==="존재하지 않는 유저") {
                        return {
                            data : {
                                email : room.member1 === loggedInUserId ? room.member2 : room.member1,
                                imageType : null,
                                nickname : "알 수 없음"
                            }
                        };
                    }
                });

                return {
                    ...room,
                    lastMessage: lastMessage ? {
                        ...lastMessage,
                        roomId: room.roomId,
                        participants: [room.member1, room.member2],
                        write_day: new Date(lastMessage.write_day).toISOString()
                    } : {
                        message: '메시지가 없습니다',
                        roomId: room.roomId,
                        participants: [room.member1, room.member2],
                        write_day: new Date().toISOString()
                    },
                    email: userInfo.data.email,
                    // image: 'data:' + userInfo.data.imageType + ';base64,' + userInfo.data.imageBlob,
                    image: userInfo.data.imageType,
                    nickname: userInfo.data.nickname
                };
            }));

            // 최신순으로 정렬 (마지막 메시지 기준)
            chatRoomsWithMessages.sort((a, b) => {
                const dateA = new Date(a.lastMessage?.write_day || 0);
                const dateB = new Date(b.lastMessage?.write_day || 0);
                return dateB - dateA;
            });

            return chatRoomsWithMessages;
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
            throw new Error(error.message);
        }
    }
);

// 단체 채팅방을 가져오는 비동기 Thunk
export const fetchTogetherChatRooms = createAsyncThunk(
    'together/fetchChatRooms',
    async ({ serverUrl, userId }) => {
        try {
            const response = await axios.get('http://localhost:8889/api/togetherChatRooms');
            const chatRooms = response.data.filter(room => room.members.includes(userId));
            console.log(chatRooms);
            const chatRoomsWithMessages = await Promise.all(chatRooms.map(async (room) => {
                const messagesResponse = await axios.get(`http://localhost:8889/api/togetherMessages/${room.roomId}`);
                const messages = messagesResponse.data;
                const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

                const members = await Promise.all(room.members.map(async (member) => {
                    const memberInfo = await axios.get(serverUrl + '/match/chattingTogether', {
                        params: { email: member }
                    }).catch((err)=>{
                        if (err.response.data.message==="존재하지 않는 유저") {
                            return {
                                data : {
                                    email : member,
                                    imageType : null,
                                    nickname : "알 수 없음"
                                }
                            };
                        }
                    });;
                    return {
                        email: memberInfo.data.email,
                        // image: 'data:' + memberInfo.data.imageType + 
                        // ';base64,' + memberInfo.data.imageBlob,
                        image: memberInfo.data.imageType,
                        nickname: memberInfo.data.nickname
                    };
                }));

                return {
                    ...room,
                    members: members,
                    lastMessage: lastMessage ? {
                        ...lastMessage,
                        roomId: room.roomId,
                        participants: room.members,
                        write_day: new Date(lastMessage.write_day).toISOString(),
                        read: lastMessage.read || []
                    } : {
                        message: '메시지가 없습니다',
                        roomId: room.roomId,
                        participants: room.members,
                        write_day: new Date().toISOString(),
                        read: []
                    }
                };
            }));

            // 최신순으로 정렬 (마지막 메시지 기준)
            chatRoomsWithMessages.sort((a, b) => {
                const dateA = new Date(a.lastMessage?.write_day || 0);
                const dateB = new Date(b.lastMessage?.write_day || 0);
                return dateB - dateA;
            });

            return chatRoomsWithMessages;
        } catch (error) {
            console.error('Error fetching together chat rooms:', error);
            throw new Error(error.message);
        }
    }
);

// 1:1채팅방 숨기기
export const updateOneOnOneChatRoomStatus = createAsyncThunk(
    'chat/updateOneOnOneChatRoomStatus',
    async ({ roomId }, { dispatch }) => {
        if (!roomId) {
            console.error('Invalid roomId:', roomId);
            return; // roomId가 유효하지 않으면 실행 중지
        }

        try {
            await axios.put(`http://localhost:8889/api/chatRooms/${roomId}`);
            dispatch(chatRoomStatusUpdated({ roomId, isTogether: false }));
        } catch (error) {
            console.error('채팅방 상태 업데이트 오류:', error);
            throw new Error(error.message); // 에러 메시지 처리
        }
    }
);
//단체 채팅방 나가기
export const removeUserFromTogetherChatRoom = createAsyncThunk(
    'together/removeUserFromChatRoom',
    async ({ roomId, userId, mode }, { dispatch }) => {
        if (!roomId || !userId) {
            console.error('Invalid roomId or userId:', roomId, userId);
            return;
        }
        try {
            if (mode != 'kick') {   // 자기가 직접 나간 경우
                // API 요청으로 사용자를 제거
                await axios.put(`http://localhost:8889/api/togetherChatRooms/${roomId}/leave`, { userId });
                dispatch(userRemovedFromChatRoom({ roomId, userId }));
            } else {    // 강퇴당한 경우
                await axios.put(`http://localhost:8889/api/togetherChatRooms/${roomId}/kick`, { userId });
                dispatch(userRemovedFromChatRoom({ roomId, userId }));
            }
        } catch (error) {
            console.error('단체 채팅방에서 사용자 제거 오류:', error);
            throw new Error(error.message);
        }
    }
);

// 읽음 상태를 업데이트하는 비동기 Thunk
export const updateMessageReadStatus = createAsyncThunk(
    'chat/updateMessageReadStatus',
    async ({ roomId }, { dispatch }) => {
        try {
            // 서버에 읽음 상태 업데이트 요청
            await axios.put(`http://localhost:8889/api/messages/${roomId}/read`);
            
            // 상태 업데이트
            dispatch(messageRead({ roomId }));
        } catch (error) {
            console.error('메시지 읽음 상태 업데이트 오류:', error);
            throw new Error(error.message);
        }
    }
);

// 단체 채팅 메시지 읽음 상태를 업데이트하는 비동기 Thunk
export const updateTogetherMessageReadStatus = createAsyncThunk(
    'together/updateMessageReadStatus',
    async ({ roomId, userId }, { dispatch }) => {
        console.log('Thunk called with userId:', userId); // 디버깅용
        try {
            await axios.put(`http://localhost:8889/api/togetherMessages/${roomId}/read`, { userId });
            dispatch(messageReadTogether({ roomId, userId }));
        } catch (error) {
            console.error('단체 채팅 메시지 읽음 상태 업데이트 오류:', error);
            throw new Error(error.message);
        }
    }
);
// 읽지 않은 사용자 1:1
export const getUnreadUsersInOneOnOneChat = (room) => {
    if (!room || !room.messages) return [];

    const lastMessage = room.lastMessage;
    if (!lastMessage) return [];

    return lastMessage.read === 0 ? [room.member1, room.member2].filter(member => member !== room.loggedInUserId) : [];
};

// 읽지 않은 사용자 단체
export const getUnreadUsersInTogetherChat = (room, loggedInUserId) => {
    if (!room || !room.members || !room.lastMessage) return [];

    const { lastMessage, members } = room;

    // 메시지를 읽지 않은 멤버 추출
    const unreadUsers = members.filter(member => !lastMessage.read.includes(member) && member !== loggedInUserId);
    return unreadUsers;
};
export const selectUnreadStatus = (state) => state.chat.unreadStatus; 

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedChat(state, action) {
            const chatData = action.payload;
            chatData.messages = chatData.messages.map(message => ({
                ...message,
                write_day: new Date(message.write_day).toISOString()
            }));
            state.selectedChat = chatData;
        },
        setMessageInput(state, action) {
            state.messageInput = action.payload;
        },
        setShowMessageInput(state, action) {
            state.showMessageInput = action.payload;
        },
        setActiveKey(state, action) {
            state.activeKey = action.payload;
        },
        appendMessageToChat(state, action) {
            if (state.selectedChat) {
                state.selectedChat.messages.push({
                    ...action.payload,
                    write_day: new Date(action.payload.write_day).toISOString()
                });
                state.selectedChat.lastMessage = {
                    ...action.payload,
                    roomId: state.selectedChat.roomId,
                    participants: [state.selectedChat.member1, state.selectedChat.member2],
                    write_day: new Date(action.payload.write_day).toISOString()
                };
            }
        },
        appendMessageToTogetherChat(state, action) {
            const { roomId, message } = action.payload;
            const existingRoom = state.togetherChatRooms.find(room => room.roomId === roomId);
            if (existingRoom) {
                existingRoom.messages.push({
                    ...message,
                    write_day: new Date(message.write_day).toISOString(),
                    read: []
                });
                existingRoom.lastMessage = {
                    ...message,
                    roomId: existingRoom.roomId,
                    participants: existingRoom.members,
                    write_day: new Date(message.write_day).toISOString(),
                    read: []
                };
            }
        },
        updateLastMessageInChatRooms(state, action) {
            const { roomId, message } = action.payload;
            state.chatRooms = state.chatRooms.map(room =>
                room.roomId === roomId ? {
                    ...room,
                    lastMessage: {
                        ...message,
                        roomId: room.roomId,
                        participants: [room.member1, room.member2],
                        write_day: new Date(message.write_day).toISOString()
                    }
                } : room
            );
        },
        updateLastMessageInTogetherChatRooms(state, action) {
            const { roomId, message } = action.payload;
            state.togetherChatRooms = state.togetherChatRooms.map(room =>
                room.roomId === roomId ? {
                    ...room,
                    lastMessage: {
                        ...message,
                        roomId: room.roomId,
                        participants: room.members,
                        write_day: new Date(message.write_day).toISOString(),
                        read: Array.isArray(message.read) ? [...new Set([...message.read, action.payload.userId])] : [action.payload.userId]
                    }
                } : room
            );
        },
        messageRead(state, action) {
            const { roomId } = action.payload;
            state.chatRooms = state.chatRooms.map(room =>
                room.roomId === roomId ? {
                    ...room,
                    messages: room.messages.map(message => ({
                        ...message,
                        read: 1
                    })),
                    lastMessage: {
                        ...room.lastMessage,
                        read: 1
                    }
                } : room
            );
        },
        markMessagesAsRead(state, action) {
            const { roomId, userId } = action.payload;
            console.log('Reducer called with userId:', userId);
            state.chatRooms = state.chatRooms.map(room => 
                room.roomId === roomId ? {
                    ...room,
                    lastMessage: room.lastMessage ? {
                        ...room.lastMessage,
                        read: room.lastMessage.read ? [...new Set([...room.lastMessage.read, userId])] : [userId]
                    } : room.lastMessage
                } : room
            );
        },
        messageReadTogether(state, action) {
            const { roomId, userId } = action.payload;
            state.togetherChatRooms = state.togetherChatRooms.map(room =>
                room.roomId === roomId ? {
                    ...room,
                    messages: room.messages.map(message => ({
                        ...message,
                        read: Array.isArray(message.read) ? [...new Set([...message.read, userId])] : [userId]
                    })),
                    lastMessage: {
                        ...room.lastMessage,
                        read: Array.isArray(room.lastMessage.read) ? [...new Set([...room.lastMessage.read, userId])] : [userId]
                    }
                } : room
            );
        },
        markTogetherMessagesAsRead(state, action) {
            const { roomId, userId } = action.payload;
            state.togetherChatRooms = state.togetherChatRooms.map(room => 
                room.roomId === roomId ? {
                    ...room,
                    lastMessage: room.lastMessage ? {
                        ...room.lastMessage,
                        read: room.lastMessage.read ? [...new Set([...room.lastMessage.read, userId])] : [userId]
                    } : room.lastMessage
                } : room
            );
        },
        chatRoomStatusUpdated(state, action) {
            const { roomId, isTogether } = action.payload;
            if (isTogether) {
                state.togetherChatRooms = state.togetherChatRooms.filter(room => room.roomId !== roomId);
            } else {
                state.chatRooms = state.chatRooms.map(room =>
                    room.roomId === roomId ? { ...room, match: 3 } : room
                ).filter(room => room.match !== 3);
            }
            // 선택된 채팅방이 삭제된 경우, 선택된 채팅방을 null로 설정
            if (state.selectedChat && state.selectedChat.roomId === roomId) {
                state.selectedChat = null;
            }
        },
        userRemovedFromChatRoom(state, action) {
            const { roomId, userId } = action.payload;
            state.togetherChatRooms = state.togetherChatRooms.map(room =>
                room.roomId === roomId ? {
                    ...room,
                    members: room.members.filter(member => member !== userId)
                } : room
            );
            // 선택된 채팅방에서 나간 경우, selectedChat을 null로 설정
            if (state.selectedChat && state.selectedChat.roomId === roomId) {
                state.selectedChat = null;
            }
        },
        updateUnreadStatus(state, action) {
            const { roomId, userEmail, readStatus } = action.payload;
            if (!state[roomId]) {
                state[roomId] = {};
            }
            state[roomId][userEmail] = readStatus;
        },
        clearUnreadStatus(state, action) {
            const { roomId } = action.payload;
            if (roomId && state[roomId]) {
                state[roomId] = {}; // 특정 방의 읽음 상태를 초기화
            }
        },
        clearAllUnreadStatus(state, action) {
            // 모든 방의 읽음 상태를 초기화합니다.
            Object.keys(state).forEach(roomId => {
                state[roomId] = {};
            });
        }
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatRooms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchChatRooms.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.chatRooms = action.payload;
            })
            .addCase(fetchChatRooms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchTogetherChatRooms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTogetherChatRooms.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.togetherChatRooms = action.payload;
            })
            .addCase(fetchTogetherChatRooms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(removeUserFromTogetherChatRoom.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(removeUserFromTogetherChatRoom.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { roomId, userId } = action.meta.arg;
                state.togetherChatRooms = state.togetherChatRooms.map(room =>
                    room.roomId === roomId ? {
                        ...room,
                        members: room.members.filter(member => member !== userId)
                    } : room
                );
                // 선택된 채팅방에서 나간 경우, selectedChat을 null로 설정
                if (state.selectedChat && state.selectedChat.roomId === roomId) {
                    state.selectedChat = null;
                }
            })
            .addCase(updateOneOnOneChatRoomStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;

            });
    }
});

export const {
    setSelectedChat,
    setMessageInput,
    setShowMessageInput,
    setActiveKey,
    appendMessageToChat,
    updateLastMessageInChatRooms,
    updateLastMessageInTogetherChatRooms,
    markMessagesAsRead,
    messageRead,
    messageReadTogether,
    markTogetherMessagesAsRead,
    chatRoomStatusUpdated,
    userRemovedFromChatRoom,
    updateUnreadStatus,
    clearUnreadStatus,
    clearAllUnreadStatus
} = chatSlice.actions;

export default chatSlice.reducer;