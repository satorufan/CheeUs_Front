import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 정의
const initialState = {
    selectedChat: null,
    chatRooms: [],
    messageInput: '',
    showMessageInput: false,
    activeKey: 'one'
};

// 슬라이스 생성
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // 선택된 채팅방 설정
        setSelectedChat(state, action) {
            state.selectedChat = action.payload;
        },
        // 채팅방 목록 설정
        setChatRooms(state, action) {
            state.chatRooms = action.payload;
        },
        // 메시지 입력 설정
        setMessageInput(state, action) {
            state.messageInput = action.payload;
        },
        // 메시지 입력 필드 보이기 설정
        setShowMessageInput(state, action) {
            state.showMessageInput = action.payload;
        },
        // 활성 탭 설정
        setActiveKey(state, action) {
            state.activeKey = action.payload;
        }
    }
});

// 액션과 리듀서를 export
export const {
    setSelectedChat,
    setChatRooms,
    setMessageInput,
    setShowMessageInput,
    setActiveKey
} = chatSlice.actions;

export default chatSlice.reducer;
