import React, { useState, useEffect } from 'react';
import { Search, ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chatPage.css';
import axios from 'axios';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null); // 선택된 채팅방 상태
    const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록 상태
    const [messageInput, setMessageInput] = useState(''); // 메시지 입력 상태
    const [loggedInUserId, setLoggedInUserId] = useState(101);

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/chatRooms'); // 백엔드 API로부터 채팅방 목록 가져오기
                // 로그인된 사용자의 아이디와 일치하는 채팅방만 필터링하여 설정
                const filteredRooms = response.data.filter(room => room.member1 === loggedInUserId || room.member2 === loggedInUserId);
                setChatRooms(filteredRooms); // 가져온 데이터로 채팅방 목록 상태 업데이트
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
            }
        };

        fetchChatRooms(); // 함수 호출하여 채팅방 목록 가져오기
    }, [loggedInUserId]); // 로그인된 사용자의 아이디가 변경될 때마다 실행

    // 채팅방 클릭 시 처리하는 함수
    const handlePersonClick = (roomId) => {
        const selectedRoom = chatRooms.find(room => room.id === roomId);
        setSelectedChat(selectedRoom);
    };

    // 메시지 전송 처리 함수
    const sendMessage = async () => {
        if (!messageInput.trim()) return; // 메시지 입력이 없으면 함수 종료

        const newMessage = {
            chat_room_id: selectedChat.roomId,
            sender_id: selectedChat.member1, // 예시로, 실제로는 로그인한 사용자의 ID 사용해야 함
            message: messageInput,
            write_day: new Date().toISOString(),
            read: 0 // 예시로, 실제로는 메시지 읽음 상태를 적절히 처리해야 함
        };

        try {
            const response = await axios.post('http://localhost:8080/api/messages', newMessage); // 백엔드 API로 메시지 전송
            console.log('Message sent successfully:', response.data);
            // 메시지 전송 후, 채팅창 초기화 또는 새로운 메시지를 목록에 추가할 수 있음
            setMessageInput(''); // 입력 필드 초기화
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="container-fluid chat-wrapper">
                <div className="row">
                    <div className="col-md-4 chat-left">
                        <div className="chat-top d-flex align-items-center">
                            <input type="text" className="form-control chat-search" placeholder="Search" />
                            <Search className="search-icon ml-2" />
                        </div>
                        <ul className="chat-people list-unstyled">
                            {chatRooms.map(room => (
                                <li
                                    key={room.roomId}
                                    className={`chat-person ${selectedChat && selectedChat.roomId === room.id ? 'chat-active' : ''}`}
                                    onClick={() => handlePersonClick(room.id)}
                                >
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <img src={`https://www.clarity-enhanced.net/wp-content/uploads/2020/06/profile-${room.member1}.jpg`} alt="" className="rounded-circle mr-3" />
                                            <span className="chat-name">User {room.member1}</span>
                                        </div>
                                        <span className="chat-time">2:09 PM</span>
                                    </div>
                                    <p className="chat-preview mt-1">Preview message</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-8 chat-right">
                        <div className="chat-top">
                            <span>To: <span className="chat-name">{selectedChat ? `User ${selectedChat.member1}` : 'Selected User'}</span></span>
                        </div>
                        {selectedChat &&
                            <div className="chat active-chat" data-chat={`person${selectedChat.roomId}`}>
                                {selectedChat.messages.map((message, index) => (
                                    <div key={index} className={`chat-bubble ${message.senderId === selectedChat.member1 ? 'you' : 'me'}`}>
                                        {message.message}
                                        <span className="chat-time">{message.writeDay}</span>
                                    </div>
                                ))}
                            </div>
                        }
                        <div className="chat-write d-flex align-items-center">
                            <input
                                type="text"
                                className="form-control flex-grow-1 chat-input"
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') sendMessage();
                                }}
                            />
                            <ArrowUpwardIcon className="send-icon" fontSize="large" onClick={sendMessage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;