import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chatPage.css';
import io from 'socket.io-client';
import { 
    fetchChatRooms, 
    fetchTogetherChatRooms, 
    setSelectedChat, 
    setMessageInput, 
    setShowMessageInput, 
    setActiveKey, 
    appendMessageToChat, 
    updateLastMessageInChatRooms, 
    updateLastMessageInTogetherChatRooms,
    updateMessageReadStatus,
    updateTogetherMessageReadStatus
} from '../../store/ChatSlice';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';
import axios from 'axios';

const ChatPage = () => {
    const dispatch = useDispatch();
    const activeKey = useSelector(state => state.chat.activeKey);
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const chatRooms = useSelector(state => state.chat.chatRooms);
    const togetherChatRooms = useSelector(state => state.chat.togetherChatRooms);
    const messageInput = useSelector(state => state.chat.messageInput);
    const showMessageInput = useSelector(state => state.chat.showMessageInput);

    const { token } = useContext(AuthContext);
    const socket = useRef(null);

    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
            } catch (error) {
                console.error('토큰 디코딩 중 에러 발생:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        socket.current = io('http://localhost:8888'); 
    
        const handleReceiveMessage = (message) => {
            console.log('Received message:', message);

        // 현재 활성화된 탭에 따라 채팅방 목록의 마지막 메시지를 업데이트
        if (activeKey === 'one') {
            dispatch(updateLastMessageInChatRooms({ roomId: message.chat_room_id, message }));
        } else if (activeKey === 'together') {
            dispatch(updateLastMessageInTogetherChatRooms({ roomId: message.room_id, message }));
        }

        // UI 업데이트는 선택된 채팅방이 있는 경우에만
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


    useEffect(() => {
        if (loggedInUserId) {
            dispatch(fetchChatRooms(loggedInUserId));
            dispatch(fetchTogetherChatRooms());
        }
    }, [loggedInUserId, dispatch]);

    useEffect(() => {
        dispatch(setSelectedChat({ messages: [] }));
        dispatch(setMessageInput(''));
        dispatch(setShowMessageInput(false));
    }, [activeKey, dispatch]);


    const handlePersonClick = async (roomId) => {
        try {
            const selectedRoom = chatRooms.find(room => room.roomId === roomId);
            if (!selectedRoom) {
                console.error(`roomId ${roomId}에 해당하는 채팅방을 찾을 수 없습니다.`);
                return;
            }
            const response = await axios.get(`http://localhost:8889/api/messages/${roomId}`);
            const messages = response.data.map(message => ({
                ...message,
                write_day: new Date(message.writeDay || message.write_day).toISOString()
            }));

            dispatch(setSelectedChat({ ...selectedRoom, messages }));
            dispatch(setShowMessageInput(true));
            dispatch(setMessageInput(''));
            dispatch(updateMessageReadStatus({ roomId }));
        } catch (error) {
            console.error('메시지를 불러오는 중 에러 발생:', error);
        }
    };

    const handleTogetherRoomClick = async (roomId) => {
        try {
            const selectedRoom = togetherChatRooms.find(room => room.roomId === roomId);
            if (!selectedRoom) {
                console.error(`roomId ${roomId}에 해당하는 단체 채팅방을 찾을 수 없습니다.`);
                return;
            }

            const response = await axios.get(`http://localhost:8889/api/togetherMessages/${roomId}`);
            const messages = response.data.map(message => ({
                ...message,
                write_day: new Date(message.writeDay || message.write_day).toISOString()
            }));

            dispatch(setSelectedChat({ ...selectedRoom, messages }));
            dispatch(setShowMessageInput(true));
            dispatch(setMessageInput(''));
            dispatch(updateTogetherMessageReadStatus({ roomId }));
        } catch (error) {
            console.error('메시지를 불러오는 중 에러 발생:', error);
        }
    };

    const sendMessage = async () => {
        if (!selectedChat || !messageInput.trim() || !loggedInUserId) {
            console.log('Cannot send message: No selected chat, empty input, or missing user ID.');
            return;
        }

        const newMessage = {
            sender_id: loggedInUserId,
            message: messageInput,
            write_day: new Date().toISOString(),
            read: 0,
            ...(activeKey === 'one' ? { chat_room_id: selectedChat.roomId } : { room_id: selectedChat.roomId })
        };

        socket.current.emit('sendMessage', newMessage);

        try {
            const endpoint = activeKey === 'one' ? 'http://localhost:8889/api/messages' : 'http://localhost:8889/api/togetherMessages';
            await axios.post(endpoint, newMessage);
            dispatch(setMessageInput(''));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const formatMessageTime = (writeDay) => {
        const date = new Date(writeDay);
        return `${date.getHours()}:${date.getMinutes()}`;
    };

    return (
        <div className="chat-container">
            <div className="container-fluid chat-wrapper">
                <Nav variant="tabs" defaultActiveKey="one" onSelect={(selectedKey) => dispatch(setActiveKey(selectedKey))}>
                    <Nav.Item>
                        <Nav.Link eventKey="one">단둘이</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="together">함께</Nav.Link>
                    </Nav.Item>
                </Nav>

                <div className="row">
                    {activeKey === 'one' && (
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-4 chat-left">
                                    <ChatList
                                        chatRooms={chatRooms}
                                        selectedChat={selectedChat}
                                        handlePersonClick={handlePersonClick}
                                        isTogether={false}
                                    />
                                </div>
                                <div className="col-md-8 chat-right">
                                    <ChatWindow
                                        selectedChat={selectedChat}
                                        messageInput={messageInput}
                                        showMessageInput={showMessageInput}
                                        formatMessageTime={formatMessageTime}
                                        sendMessage={sendMessage}
                                        setMessageInput={(input) => dispatch(setMessageInput(input))}
                                        activeKey={activeKey}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeKey === 'together' && (
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-4 chat-left">
                                    <ChatList
                                        chatRooms={togetherChatRooms}
                                        selectedChat={selectedChat}
                                        handlePersonClick={handleTogetherRoomClick}
                                        isTogether={true}
                                    />
                                </div>
                                <div className="col-md-8 chat-right">
                                    <ChatWindow
                                        selectedChat={selectedChat}
                                        messageInput={messageInput}
                                        showMessageInput={showMessageInput}
                                        formatMessageTime={formatMessageTime}
                                        sendMessage={sendMessage}
                                        setMessageInput={(input) => dispatch(setMessageInput(input))}
                                        activeKey={activeKey}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;