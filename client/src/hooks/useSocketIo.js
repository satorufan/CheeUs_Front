import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { 
    appendMessageToChat, 
    updateLastMessageInChatRooms, 
    updateLastMessageInTogetherChatRooms, 
} from '../store/ChatSlice';
import { useToast } from '../components/app/ToastProvider';

const useSocketIo = (activeKey, selectedChat, userEmail, setHasUnreadMessages) => {
    const dispatch = useDispatch();
    const socket = useRef(null); // 소켓 객체 참조
    const { notify } = useToast();

    useEffect(() => {
        socket.current = io('http://localhost:8888');

        const handleReceiveMessage = (message) => {
            console.log('받은 메시지:', message);
            
            if (!message) {
                console.error('잘못된 메시지 수신:', message);
                return;
            }
            
            console.log('전체 메시지 객체:', message);
            
            const { chat_room_id, room_id, member = [] } = message;
        
            console.log('Member 배열:', member);
            console.log('Member 배열 타입:', Array.isArray(member));
            
            // 모든 멤버를 문자열로 변환
            const membersAsString = member.map(m => (m ? m.toString().trim() : ''));
            console.log('문자열로 변환된 Member 배열:', membersAsString);
            
            const enrichedMessage = {
                ...message,
                room_id: activeKey === 'one' ? chat_room_id : room_id,
                member
            };
            
            if (activeKey === 'one') { // 수신메세지 스토어에 업뎃
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
            
            if (selectedChat && selectedChat.roomId) { // 활성화된 텝에 메세지 추가
                if (activeKey === 'one' && chat_room_id === selectedChat.roomId) {
                    dispatch(appendMessageToChat(enrichedMessage));
                } else if (activeKey === 'together' && room_id === selectedChat.roomId) {
                    dispatch(appendMessageToChat(enrichedMessage));
                }
            }
            
            // 사용자 이메일이 멤버 배열에 포함되어 있는지 확인
            if (userEmail && membersAsString.includes(userEmail.trim())) {
                console.log('읽지 않은 메시지 상태를 true로 설정합니다.');
                setHasUnreadMessages(true);

                notify('새로운 메시지가 도착했습니다!');
            } else {
                console.log('멤버 배열에 사용자 이메일이 없습니다.');
            }
        };

        socket.current.on('receiveMessage', handleReceiveMessage); // 이벤트 수신할때마다

        return () => { // 소켓 연결 해제
            socket.current.off('receiveMessage', handleReceiveMessage);
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [dispatch, activeKey, selectedChat, userEmail, notify]);

    return socket;
};

export default useSocketIo;
