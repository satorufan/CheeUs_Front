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

        const handleCreateTogetherRoom = async (message) => {
            console.log("Created Room : ", message);

            const createRoom = 'http://localhost:8889/api/createOneoneRoom';
            // await axios.post(createRoom, newRoom);
        };

        const handleReceiveMessage = (message) => {
            console.log('Received message:', message);

            if (activeKey === 'one') {
                dispatch(updateLastMessageInChatRooms({ roomId: message.chat_room_id, message }));
            } else if (activeKey === 'together') {
                dispatch(updateLastMessageInTogetherChatRooms({ roomId: message.room_id, message }));
            }

            if (selectedChat && selectedChat.roomId) {
                if (activeKey === 'one' && message.chat_room_id === selectedChat.roomId) {
                    dispatch(appendMessageToChat(message));
                } else if (activeKey === 'together' && message.room_id === selectedChat.roomId) {
                    dispatch(appendMessageToChat(message));
                }
            }
        };

        socket.current.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.current.off('receiveMessage', handleReceiveMessage);
            socket.current.disconnect();
        };
    }, [dispatch, activeKey, selectedChat]);

    return socket;
};

export default useSocketIo;