
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chatPage.css';
import io from 'socket.io-client';
import { fetchChatRooms, setSelectedChat, setMessageInput, setShowMessageInput, setActiveKey, appendMessageToChat, updateLastMessageInChatRooms } from '../../store/ChatSlice';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';
import axios from 'axios';

const ChatPage = () => {
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const activeKey = useSelector(state => state.chat.activeKey);
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const chatRooms = useSelector(state => state.chat.chatRooms);
    const messageInput = useSelector(state => state.chat.messageInput);
    const showMessageInput = useSelector(state => state.chat.showMessageInput);
    const chatStatus = useSelector(state => state.chat.status);
    const chatError = useSelector(state => state.chat.error);

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
        socket.current = io('http://localhost:8888'); // 서버 URL
    
        const handleReceiveMessage = (message) => {
            console.log('Received message:', message);
            dispatch(appendMessageToChat(message));
            dispatch(updateLastMessageInChatRooms(message));
        };
    
        // 이벤트 핸들러 등록
        socket.current.on('receiveMessage', handleReceiveMessage);
    
        return () => {
            // 컴포넌트 언마운트 시 핸들러 제거
            socket.current.off('receiveMessage', handleReceiveMessage);
            socket.current.disconnect();
        };
    }, [dispatch]);

    useEffect(() => {
        if (loggedInUserId) {
            dispatch(fetchChatRooms(loggedInUserId));
        }
    }, [loggedInUserId, dispatch]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedChat]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const handlePersonClick = async (roomId) => {
        try {
            const selectedRoom = chatRooms.find(room => room.roomId === roomId);
            if (!selectedRoom) {
                console.error(`roomId ${roomId}에 해당하는 채팅방을 찾을 수 없습니다.`);
                return;
            }
            const response = await axios.get(`http://localhost:8889/api/messages/${roomId}`);

            const messages = response.data.map(message => {
                const date = new Date(message.write_day);
                return {
                    ...message,
                    write_day: !isNaN(date) ? date.toISOString() : new Date().toISOString()
                };
            });

            dispatch(setSelectedChat({ ...selectedRoom, messages }));
            dispatch(setShowMessageInput(true));
            dispatch(setMessageInput(''));
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
            chat_room_id: selectedChat.roomId,
            sender_id: loggedInUserId,
            message: messageInput,
            write_day: new Date().toISOString(),
            read: 0
        };
    
        // 소켓으로 메시지 전송
        socket.current.emit('sendMessage', newMessage);
        
        try {
            await axios.post('http://localhost:8889/api/messages', newMessage);
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
                                    />
                                </div>
                                <div className="col-md-8 chat-right">
                                    <ChatWindow
                                        selectedChat={selectedChat}
                                        messageInput={messageInput}
                                        showMessageInput={showMessageInput}
                                        formatMessageTime={formatMessageTime}
                                        scrollRef={scrollRef}
                                        sendMessage={sendMessage}
                                        setMessageInput={(input) => dispatch(setMessageInput(input))}
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
                                        chatRooms={chatRooms}
                                        selectedChat={selectedChat}
                                        handlePersonClick={handlePersonClick}
                                    />
                                </div>
                                <div className="col-md-8 chat-right">
                                    <ChatWindow
                                        selectedChat={selectedChat}
                                        messageInput={messageInput}
                                        showMessageInput={showMessageInput}
                                        formatMessageTime={formatMessageTime}
                                        scrollRef={scrollRef}
                                        sendMessage={sendMessage}
                                        setMessageInput={(input) => dispatch(setMessageInput(input))}
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
