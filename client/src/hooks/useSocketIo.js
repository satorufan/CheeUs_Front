import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { 
    appendMessageToChat, 
    updateLastMessageInChatRooms, 
    updateLastMessageInTogetherChatRooms 
} from '../store/ChatSlice';

const useSocketIo = (activeKey, selectedChat) => {
    const dispatch = useDispatch();
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:8888');

        const handleReceiveMessage = (message) => {
            console.log('Received message:', message);

            // message 객체에 room_id와 members를 추가한 새로운 객체를 만듦
            const enrichedMessage = {
                ...message,
                room_id: activeKey === 'one' ? message.chat_room_id : message.room_id,
                members: message.members,  // 메시지에 멤버 데이터가 포함되어 있다고 가정
            };

            // activeKey에 따라 1:1 채팅방 또는 단체 채팅방의 마지막 메시지를 업데이트
            if (activeKey === 'one') {
                dispatch(updateLastMessageInChatRooms({ 
                    roomId: message.chat_room_id, 
                    message: enrichedMessage 
                }));
            } else if (activeKey === 'together') {
                dispatch(updateLastMessageInTogetherChatRooms({ 
                    roomId: message.room_id, 
                    message: enrichedMessage 
                }));
            }

            // 선택된 채팅방이 현재 활성화된 상태인지 확인 후 메시지를 추가
            if (selectedChat && selectedChat.roomId) {
                if (activeKey === 'one' && message.chat_room_id === selectedChat.roomId) {
                    dispatch(appendMessageToChat(enrichedMessage));
                } else if (activeKey === 'together' && message.room_id === selectedChat.roomId) {
                    dispatch(appendMessageToChat(enrichedMessage));
                }
            }
        };

        // 소켓 이벤트 리스너 설정
        socket.current.on('receiveMessage', handleReceiveMessage);

        // 컴포넌트가 언마운트될 때 소켓 이벤트 리스너 제거 및 소켓 연결 해제
        return () => {
            socket.current.off('receiveMessage', handleReceiveMessage);
            socket.current.disconnect();
        };
    }, [dispatch, activeKey, selectedChat]);

    return socket;
};

export default useSocketIo;