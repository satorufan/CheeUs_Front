import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 초기 상태 정의
const initialState = {
    selectedChat: null,
    chatRooms: [],
    messageInput: '',
    showMessageInput: false,
    activeKey: 'one',
    status: 'idle',
    error: null
};

// 채팅방을 가져오는 비동기 Thunk
export const fetchChatRooms = createAsyncThunk(
    'chat/fetchChatRooms',
    async (userId) => {
        const response = await axios.get('http://localhost:8889/api/chatRooms');
        const chatRooms = response.data.filter(room => room.member1 === userId || room.member2 === userId);
        
        const chatRoomsWithMessages = await Promise.all(chatRooms.map(async (room) => {
            const messagesResponse = await axios.get(`http://localhost:8889/api/messages/${room.roomId}`);
            const lastMessage = messagesResponse.data[messagesResponse.data.length - 1];
            return {
                ...room,
                lastMessage: lastMessage ? {
                    ...lastMessage,
                    write_day: new Date(lastMessage.write_day)
                } : null
            };
        }));

        return chatRoomsWithMessages;
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
                write_day: message.write_day
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
                state.selectedChat.messages.push(action.payload);
            }
        },
        updateLastMessageInChatRooms(state, action) {
            const roomIndex = state.chatRooms.findIndex(room => room.roomId === state.selectedChat.roomId);
            if (roomIndex !== -1) {
                state.chatRooms[roomIndex] = {
                    ...state.chatRooms[roomIndex],
                    lastMessage: action.payload
                };
            }
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
            });
    }
});

export const { setSelectedChat, setMessageInput, setShowMessageInput, setActiveKey, appendMessageToChat, updateLastMessageInChatRooms } = chatSlice.actions;

export default chatSlice.reducer;
