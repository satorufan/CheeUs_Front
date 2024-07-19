import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chatPage.css';
import axios from 'axios';
import io from 'socket.io-client';
import { setSelectedChat, setChatRooms, setMessageInput, setShowMessageInput, setActiveKey } from '../../store/ChatSlice';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';

const ChatPage = () => {
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const activeKey = useSelector(state => state.chat.activeKey);
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const chatRooms = useSelector(state => state.chat.chatRooms);
    const messageInput = useSelector(state => state.chat.messageInput);
    const showMessageInput = useSelector(state => state.chat.showMessageInput);

    const { token } = useContext(AuthContext); // Context에서 JWT 토큰 가져오기
    const socket = useRef(null);

    // 사용자 ID 상태 변수
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.userId); // 또는 decodedToken.sub 등 사용자 ID를 나타내는 적절한 속성
                console.log('Logged in user ID:', decodedToken.email);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            console.log('Token is not available');
        }
    }, [token]);

    useEffect(() => {
        socket.current = io('http://localhost:8088');
        return () => {
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (loggedInUserId) {
            const fetchChatRooms = async () => {
                try {
                    const response = await axios.get('http://localhost:8088/api/chatRooms');
                    const filteredRooms = response.data.filter(room => room.member1 === loggedInUserId || room.member2 === loggedInUserId);
                    dispatch(setChatRooms(filteredRooms));
                } catch (error) {
                    console.error('Error fetching chat rooms:', error);
                }
            };
            fetchChatRooms();
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
            const response = await axios.get(`http://localhost:8080/api/messages/${roomId}`);
            dispatch(setSelectedChat({ ...selectedRoom, messages: response.data }));
            dispatch(setShowMessageInput(true));
            dispatch(setMessageInput(''));
        } catch (error) {
            console.error('메시지를 불러오는 중 에러 발생:', error);
        }
    };

    const sendMessage = async () => {
        if (!selectedChat || !messageInput.trim() || !loggedInUserId) {
            console.log('메세지 보낼 수 없음: No chat selected, message input is empty, or user ID is missing.');
            return;
        }

        const newMessage = {
            chat_room_id: selectedChat.roomId,
            sender_id: loggedInUserId,
            message: messageInput,
            write_day: new Date().toISOString(),
            read: 0
        };

        try {
            await axios.post('http://localhost:8080/api/messages', newMessage);
            dispatch(setSelectedChat(prevChat => ({
                ...prevChat,
                messages: [...(prevChat.messages || []), newMessage]
            })));
            socket.current.emit('sendMessage', newMessage);
            console.log('Message sent successfully');
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
