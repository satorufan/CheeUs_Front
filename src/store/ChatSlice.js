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
            const response = await axios.get('http://localhost:8889/api/chatRooms');
            const chatRooms = response.data.filter(room => room.member1 === userId || room.member2 === userId);

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
    updateLastMessageInTogetherChatRooms
} = chatSlice.actions;

export default chatSlice.reducer;
