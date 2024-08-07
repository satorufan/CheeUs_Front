import React, { useState, useEffect, useRef, useContext,  useCallback,  } from 'react';
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
import useSocketIo from '../../hooks/useSocketIo';

const ChatPage = () => {
    const dispatch = useDispatch();
    const activeKey = useSelector(state => state.chat.activeKey);
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const chatRooms = useSelector(state => state.chat.chatRooms);
    const togetherChatRooms = useSelector(state => state.chat.togetherChatRooms);
    const messageInput = useSelector(state => state.chat.messageInput);
    const showMessageInput = useSelector(state => state.chat.showMessageInput);

    const { token, serverUrl } = useContext(AuthContext);
    //const socket = useRef(null);

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

    const socket = useSocketIo(activeKey, selectedChat); // 커스텀훅

    useEffect(() => {
        if (loggedInUserId) {
            dispatch(fetchChatRooms({serverUrl, loggedInUserId}));
            dispatch(fetchTogetherChatRooms());
        }
    }, [loggedInUserId, dispatch]);

    useEffect(() => {
        dispatch(setSelectedChat({ messages: [] }));
        dispatch(setMessageInput(''));
        dispatch(setShowMessageInput(false));
    }, [activeKey, dispatch]);


    const handlePersonClick = useCallback(async (roomId) => {
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
    }, [chatRooms, dispatch]);

    const handleTogetherRoomClick = useCallback(async (roomId) => {
        const userId = loggedInUserId;
        try {
            const selectedRoom = togetherChatRooms.find(room => room.roomId === roomId);
            if (!selectedRoom) {
                console.error(`roomId ${roomId}에 해당하는 단체 채팅방을 찾을 수 없습니다.`);
                return;
            }

            const response = await axios.get(`http://localhost:8889/api/togetherMessages/${roomId}`);
            const messages = response.data.map(message => ({
                ...message,
                write_day: new Date(message.writeDay || message.write_day).toISOString(),
                read: Array.isArray(message.read) ? message.read : [message.read]
            }));
        
            dispatch(setSelectedChat({ ...selectedRoom, messages }));
            dispatch(setShowMessageInput(true));
            dispatch(setMessageInput(''));
            dispatch(updateTogetherMessageReadStatus({ roomId, userId }));
        } catch (error) {
            console.error('메시지를 불러오는 중 에러 발생:', error);
        }
    }, [loggedInUserId, togetherChatRooms, dispatch]);

    const sendMessage = async (inputMessage) => {
        if (!selectedChat || !inputMessage.trim() || !loggedInUserId) {
            console.log('Cannot send message: No selected chat, empty input, or missing user ID.');
            return;
        }

        const newMessage = {
            sender_id: loggedInUserId,
            message: inputMessage,
            write_day: new Date().toISOString(),
            read: 0,
            ...(activeKey === 'one' ? { chat_room_id: selectedChat.roomId } : { room_id: selectedChat.roomId, read: [loggedInUserId] })
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