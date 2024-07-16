import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chatPage.css';
import axios from 'axios';
import io from 'socket.io-client';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null); // 선택된 채팅방 상태
    const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록 상태
    const [messageInput, setMessageInput] = useState(''); // 메시지 입력 상태
    const [showMessageInput, setShowMessageInput] = useState(false); // 메시지 입력 폼 보이기 여부 상태
    const [socket, setSocket] = useState(null); // Socket.io 클라이언트 인스턴스
    const scrollRef = useRef(null); // 채팅 스크롤 맨 아래로 이동을 위한 Ref

    const loggedInUserId = 101;
    
    useEffect(() => {
        // Socket.io 서버와의 연결 설정
        const newSocket = io('http://localhost:8088'); // 소켓 서버의 URL에 맞게 설정
        setSocket(newSocket);

        return () => {
            newSocket.disconnect(); // 컴포넌트 언마운트 시 소켓 연결 해제
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [selectedChat]);
 
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

    useEffect(() => {
        scrollToBottomOnRender(); // 초기 렌더링 시 맨 아래로 스크롤
    }, []);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const scrollToBottomOnRender = () => {
        setTimeout(() => {
            scrollToBottom();
        }, 100); // setTimeout을 사용하여 다음 렌더링 사이클에서 실행되도록 함
    };

    const handlePersonClick = async (roomId) => {
        try {
            // 클릭된 채팅방 객체 찾기
            const selectedRoom = chatRooms.find(room => room.roomId === roomId);

            if (!selectedRoom) {
                console.error(`roomId ${roomId}에 해당하는 채팅방을 찾을 수 없습니다.`);
                return;
            }

            // 채팅방의 메시지 가져오기
            const response = await axios.get(`http://localhost:8080/api/messages/${roomId}`);

            // 선택된 채팅방 상태 업데이트
            setSelectedChat({ ...selectedRoom, messages: response.data });
            setShowMessageInput(true); // 메시지 입력 필드 보이기
            setMessageInput(''); // 메시지 입력 초기화
        } catch (error) {
            console.error('메시지를 불러오는 중 에러 발생:', error);
            
        }
    };

    const sendMessage = async () => {
        if (!selectedChat || !messageInput.trim()) {
            console.log('메세지 보낼 수 없음: No chat selected or message input is empty.');
            return;
        }

        const newMessage = {
            chat_room_id: selectedChat.roomId,
            sender_id: loggedInUserId, // 현재 로그인한 사용자의 아이디
            message: messageInput,
            write_day: new Date().toISOString(),
            read: 0 // 예시로, 실제로는 메시지 읽음 상태를 적절히 처리해야 함
        };

        try {
            // 메시지를 백엔드 API로 전송하여 MongoDB에 저장
            const response = await axios.post('http://localhost:8080/api/messages', newMessage);

            // 저장된 메시지 데이터를 채팅방 데이터에 추가
            setSelectedChat(prevChat => ({
                ...prevChat,
                messages: [...(prevChat.messages || []), newMessage] // Ensure messages array exists or initialize as empty
            }));

            // Socket.io를 통해 메시지 전송
            socket.emit('sendMessage', newMessage);

            console.log('Message sent successfully:', response.data);
            setMessageInput(''); // 입력 필드 초기화
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
                                    className={`chat-person ${selectedChat && selectedChat.roomId === room.roomId ? 'chat-active' : ''}`}
                                    onClick={() => handlePersonClick(room.roomId)}
                                >
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <img src={`https://www.clarity-enhanced.net/wp-content/uploads/2020/06/profile-${room.member1}.jpg`} alt="" className="rounded-circle mr-3" />
                                            <span className="chat-name">{room.member1 !== loggedInUserId ? room.member1 : room.member2}</span>
                                        </div>
                                        <span className="chat-time">2:09 PM</span>
                                    </div>
                                    <p className="chat-preview mt-1">Preview message</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-8 chat-right">
                    {selectedChat && (
                            <React.Fragment>
                                <div className="chat-top">
                                    <span>To: <span className="chat-name">{`User ${selectedChat.member1 !== loggedInUserId ? selectedChat.member1 : selectedChat.member2}`}</span></span>
                                </div>
                                <div className="chat active-chat" data-chat={`person${selectedChat.roomId}`}>
                                    {selectedChat.messages && selectedChat.messages.map((message, index) => (
                                        <div key={index} className={`chat-bubble ${message.sender_id === loggedInUserId ? 'me' : 'you'}`}>
                                            <div>{message.message}</div>
                                            <span className="chat-time">{formatMessageTime(message.write_day)}</span>
                                        </div>
                                    ))}
                                    <div ref={scrollRef}></div> 
                                </div>
                                {showMessageInput && ( 
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
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;