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
    updateLastMessageInTogetherChatRooms 
} from '../../store/ChatSlice';
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
    const togetherChatRooms = useSelector(state => state.chat.togetherChatRooms); 
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
            if (activeKey === 'one') {
                dispatch(updateLastMessageInChatRooms({ roomId: message.chat_room_id, message }));
            } else {
                dispatch(updateLastMessageInTogetherChatRooms({ roomId: message.room_id, message }));
            }
        };

        // 이벤트 핸들러 등록
        socket.current.on('receiveMessage', handleReceiveMessage);

        return () => {
            // 컴포넌트 언마운트 시 핸들러 제거
            socket.current.off('receiveMessage', handleReceiveMessage);
            socket.current.disconnect();
        };
    }, [dispatch, activeKey]);

    useEffect(() => {
        if (loggedInUserId) {
            dispatch(fetchChatRooms(loggedInUserId));
            dispatch(fetchTogetherChatRooms()); // 단체 채팅방 데이터 요청
        }
    }, [loggedInUserId, dispatch]);

    useEffect(() => {
        // activeKey가 변경될 때 selectedChat 초기화
        dispatch(setSelectedChat({ messages: [] })); // 기본값 설정
        dispatch(setMessageInput(''));
        dispatch(setShowMessageInput(false));
    }, [activeKey, dispatch]);

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
                const date = new Date(message.writeDay || message.write_day);
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

    const handleTogetherRoomClick = async (roomId) => {
        try {
            console.log('Requested roomId:', roomId); // 요청된 roomId 로그
            const selectedRoom = togetherChatRooms.find(room => room.roomId === roomId);
            console.log('Found selectedRoom:', selectedRoom); // 찾은 채팅방 로그

            if (!selectedRoom) {
                console.error(`roomId ${roomId}에 해당하는 단체 채팅방을 찾을 수 없습니다.`);
                return;
            }

            const response = await axios.get(`http://localhost:8889/api/togetherMessages/${roomId}`);
            
            // 메시지 변환 로직
            const messages = response.data.map(message => {
                const date = new Date(message.writeDay || message.write_day);
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
            sender_id: loggedInUserId,
            message: messageInput,
            write_day: new Date().toISOString(),
            read: 0
        };

        if (activeKey === 'one') {
            newMessage.chat_room_id = selectedChat.roomId;
        } else {
            newMessage.room_id = selectedChat.roomId;
        }

        // 소켓으로 메시지 전송
        socket.current.emit('sendMessage', newMessage);

        try {
            if (activeKey === 'one') {
                await axios.post('http://localhost:8889/api/messages', newMessage);
            } else {
                await axios.post('http://localhost:8889/api/togetherMessages', newMessage);
            }
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
                                    {selectedChat && selectedChat.messages ? (
                                        <ChatWindow
                                            selectedChat={selectedChat}
                                            messageInput={messageInput}
                                            showMessageInput={showMessageInput}
                                            formatMessageTime={formatMessageTime}
                                            scrollRef={scrollRef}
                                            sendMessage={sendMessage}
                                            setMessageInput={(input) => dispatch(setMessageInput(input))}
                                        />
                                    ) : (
                                        <div>채팅방을 선택하세요.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeKey === 'together' && (
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-4 chat-left">
                                    <ChatList
                                        chatRooms={togetherChatRooms} // 단체 채팅방 사용
                                        selectedChat={selectedChat}
                                        handlePersonClick={handleTogetherRoomClick} // 단체 채팅방 클릭 핸들러
                                        isTogether={true} // 단체 채팅방 여부를 나타내는 프로퍼티
                                    />
                                </div>
                                <div className="col-md-8 chat-right">
                                    {selectedChat && selectedChat.messages ? (
                                        <ChatWindow
                                            selectedChat={selectedChat}
                                            messageInput={messageInput}
                                            showMessageInput={showMessageInput}
                                            formatMessageTime={formatMessageTime}
                                            scrollRef={scrollRef}
                                            sendMessage={sendMessage}
                                            setMessageInput={(input) => dispatch(setMessageInput(input))}
                                        />
                                    ) : (
                                        <div>채팅방을 선택하세요.</div>
                                    )}
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
