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
    error: null
};

// 1:1 채팅방을 가져오는 비동기 Thunk
export const fetchChatRooms = createAsyncThunk(
    'chat/fetchChatRooms',
    async (userId) => {
        try {
            // 1:1 채팅방 데이터 요청
            const response = await axios.get('http://localhost:8889/api/chatRooms');
            // `match`가 2인 채팅방만 필터링
            const chatRooms = response.data.filter(room => room.match === 2 && (room.member1 === userId || room.member2 === userId));

            // 각 채팅방의 메시지 가져오기
            const chatRoomsWithMessages = await Promise.all(chatRooms.map(async (room) => {
                const messagesResponse = await axios.get(`http://localhost:8889/api/messages/${room.roomId}`);
                const messages = messagesResponse.data;

                const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

                return {
                    ...room,
                    lastMessage: lastMessage ? {
                        ...lastMessage,
                        write_day: new Date(lastMessage.write_day).toISOString() 
                    } : {
                        message: '메시지가 없습니다',
                        write_day: new Date().toISOString()
                    }
                };
            }));

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
    async () => {
        try {
            const response = await axios.get('http://localhost:8889/api/togetherChatRooms');
            const chatRooms = response.data;

            const chatRoomsWithMessages = await Promise.all(chatRooms.map(async (room) => {
                try {
                    const messagesResponse = await axios.get(`http://localhost:8889/api/togetherMessages/${room.roomId}`);
                    const messages = messagesResponse.data;
                    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

                    return {
                        ...room,
                        lastMessage: lastMessage ? {
                            ...lastMessage,
                            write_day: new Date(lastMessage.write_day).toISOString()
                        } : {
                            message: '메시지가 없습니다',
                            write_day: new Date().toISOString()
                        }
                    };
                } catch (error) {
                    console.error(`Messages fetch failed for roomId: ${room.roomId}`, error);
                    return {
                        ...room,
                        lastMessage: { message: '메시지가 없습니다', write_day: new Date().toISOString() }
                    };
                }
            }));

            return chatRoomsWithMessages;
        } catch (error) {
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
// 단체에서 맴버명 제거
export const removeUserFromTogetherChatRoom = createAsyncThunk(
    'together/removeUserFromChatRoom',
    async ({ roomId, userId }, { dispatch }) => {
        if (!roomId || !userId) {
            console.error('Invalid roomId or userId:', roomId, userId);
            return;
        }
        try {
            // API 요청으로 사용자를 제거
            await axios.put(`http://localhost:8889/api/togetherChatRooms/${roomId}/removeUser`, { userId });
            dispatch(userRemovedFromChatRoom({ roomId, userId }));
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
    async ({ roomId }, { dispatch }) => {
        if (!roomId) {
            console.error('Invalid roomId:', roomId);
            return; // roomId가 유효하지 않으면 실행 중지
        }

        try {
            await axios.put(`http://localhost:8889/api/togetherMessages/${roomId}/read`);
            dispatch(messageReadTogether({ roomId }));
        } catch (error) {
            console.error('단체 채팅 메시지 읽음 상태 업데이트 오류:', error);
            throw new Error(error.message);
        }
    }
);

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
            }
        },        
        updateLastMessageInChatRooms(state, action) {
            const { roomId, message } = action.payload;
            state.chatRooms = state.chatRooms.map(room =>
                room.roomId === roomId ? {
                    ...room,
                    lastMessage: {
                        ...message,
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
                        write_day: new Date(message.write_day).toISOString()
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
            const roomId = action.payload;
            state.chatRooms = state.chatRooms.map(room => 
                room.roomId === roomId ? {
                    ...room,
                    lastMessage: room.lastMessage ? {
                        ...room.lastMessage,
                        read: 1
                    } : room.lastMessage
                } : room
            );
        },
        messageReadTogether(state, action) {
            const { roomId } = action.payload;
            state.togetherChatRooms = state.togetherChatRooms.map(room =>
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
        markTogetherMessagesAsRead(state, action) {
            const roomId = action.payload;
            state.togetherChatRooms = state.togetherChatRooms.map(room => 
                room.roomId === roomId ? {
                    ...room,
                    lastMessage: room.lastMessage ? {
                        ...room.lastMessage,
                        read: 1
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
        },
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
} = chatSlice.actions;

export default chatSlice.reducer;