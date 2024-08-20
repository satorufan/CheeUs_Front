import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { 
    appendMessageToChat, 
    updateLastMessageInChatRooms, 
    updateLastMessageInTogetherChatRooms, 
} from '../store/ChatSlice';
//import { useToast } from '../components/app/ToastProvider';

const useSocketIo = (activeKey, selectedChat, userEmail, setHasUnreadMessages) => {
    const dispatch = useDispatch();
    const socket = useRef(null); // 소켓 객체 참조
    //const { notify } = useToast();

    useEffect(() => {
        socket.current = io('http://localhost:8888');

        const handleReceiveMessage = (message) => {
                        
            if (!message) {
                console.error('잘못된 메시지 수신:', message);
                return;
            }
                        
            const { chat_room_id, room_id, member = [] } = message;
            
            const membersAsString = member.map(m => (m ? m.toString().trim() : ''));
            
            const enrichedMessage = {
                ...message,
                room_id: activeKey === 'one' ? chat_room_id : room_id,
                member
            };
            
            if (activeKey === 'one') { 
                dispatch(updateLastMessageInChatRooms({ 
                    roomId: chat_room_id, 
                    message: enrichedMessage 
                }));
            } else if (activeKey === 'together') {
                dispatch(updateLastMessageInTogetherChatRooms({ 
                    roomId: room_id, 
                    message: enrichedMessage 
                }));
            }
            
            if (selectedChat && selectedChat.roomId) { 
                if (activeKey === 'one' && chat_room_id === selectedChat.roomId) {
                    dispatch(appendMessageToChat(enrichedMessage));
                } else if (activeKey === 'together' && room_id === selectedChat.roomId) {
                    dispatch(appendMessageToChat(enrichedMessage));
                }
            }
            
            if (userEmail && membersAsString.includes(userEmail.trim())) {
                if (typeof setHasUnreadMessages === 'function') {
                    setHasUnreadMessages(true);
                } else {
                    console.error('setHasUnreadMessages가 함수가 아닙니다.');
                }
                // notify('새로운 메시지가 도착했습니다!');
            } else {
                //console.log('멤버 배열에 사용자 이메일이 없습니다.');
            }
        };

        socket.current.on('receiveMessage', handleReceiveMessage); 

        return () => { 
            socket.current.off('receiveMessage', handleReceiveMessage);
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [dispatch, activeKey, selectedChat, userEmail]);

    return socket;
};

export default useSocketIo;
