import React, { useEffect, useContext, useState, useRef } from 'react';
import { AuthContext } from '../login/OAuth';
import { jwtDecode } from 'jwt-decode';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useDispatch, useSelector } from 'react-redux';
import './chatPage.css';
import { selectProfiles, fetchUserProfiles } from '../../store/MatchSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { removeUserFromTogetherChatRoom, fetchTogetherChatRooms } from '../../store/ChatSlice';
import Avatar from '@mui/material/Avatar';
import ReportModal from '../app/ReportModal';
import axios from 'axios';

const ChatWindow = ({
    selectedChat,
    messageInput,
    showMessageInput,
    formatMessageTime,
    sendMessage,
    setMessageInput,
    activeKey,
}) => {
    const { token, serverUrl, memberEmail } = useContext(AuthContext);
    const scrollRef = useRef(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [showParticipants, setShowParticipants] = useState(false);
    const [participants, setParticipants] = useState([]);
    const profiles = useSelector(selectProfiles);
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const [profileData, setProfileData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [messages, setMessages] = useState([]);   // 채팅내역, 방번호, 작성일, 프로필(이메일, 사진, 닉네임)

    // 신고 모달
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportedId, setReportedId] = useState(null);
    const handleReportModalOpen = () => setShowReportModal(true);
    const handleReportModalClose = () => setShowReportModal(false);
    

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
            } catch (error) {
                console.error('토큰 디코딩 에러:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        if (selectedChat) {
            setParticipants(selectedChat.members || []);
        }
    }, [selectedChat]);
    
    useEffect(() => { // 여기서 병합하려니까 심하게 느려짐 다른 방법 고안 필요
        if (selectedChat && selectedChat.togetherId && !isDataLoaded) {
            const memberEmails = selectedChat.members.map(member => member.email);
            
            const fetchProfiles = async () => {
                try {
                    const responses = await Promise.all(
                        memberEmails.map(email => dispatch(fetchUserProfiles({ serverUrl, memberEmail: email })))
                    );
        
                    // 모든 프로필 데이터 병합
                    const profiles = responses.flatMap(response => response.payload);
                    const profileMap = profiles.reduce((acc, profile) => {
                        acc[profile.email] = profile;
                        return acc;
                    }, {});
                    setProfileData(profileMap);
                    setIsDataLoaded(true); 
                } catch (error) {
                    console.error('Error fetching profiles:', error);
                }
            };
        
            fetchProfiles();
        }
    }, [selectedChat, isDataLoaded, dispatch, serverUrl]);


    useEffect(() => {
        if (selectedChat) {
            
            const fetchData = async () => {
                if (!selectedChat || !selectedChat.messages) return;

                const fetchMessages = async () => {
                    const results = await Promise.all(selectedChat.messages.map(async (message, index) => {

                        const messageDate = formatDate(message.write_day);
                        const senderProfile = await getProfileForSender(message.sender_id);
                        const isSameSenderAsPrevious = index > 0 && selectedChat.messages[index - 1].sender_id === message.sender_id;

                        return {
                            ...message,
                            messageDate,
                            senderProfile,
                            isSameSenderAsPrevious
                        };
                    }));

                    return results;
                };

                const messagesWithInfo = await fetchMessages();
                console.log(messagesWithInfo);
                setMessages(messagesWithInfo);
            };

            fetchData();
            // 스크롤을 하단으로 이동
            scrollToBottom();
        }
    }, [selectedChat, selectedChat?.messages]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            const element = scrollRef.current;
            const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

            if (!isAtBottom) {
                element.scrollTo({
                    top: element.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    };

    const isSender = (senderId) => senderId === loggedInUserId;

    //const getOtherUserId = () => {
    //    if (!selectedChat) return null;
    //    return selectedChat.member1 === loggedInUserId ? selectedChat.member2 : selectedChat.member1;
    //};
    // 발신자 프로필 불러오기
    const getProfileForSender = async (email) => {
        if (email === "System" || email === memberEmail) {
            return null;
        }

        try {
            const response = await axios.get(serverUrl + "/match/chattingPersonal", {
                params: { email: email }
            });

            const profile = response.data;
            return {
                email : profile.email,
                nickname : profile.nickname,
                image : profile && profile.imageBlob.length > 0 ? `data:${profile.imageType};base64,${profile.imageBlob}`
                    : `${process.env.PUBLIC_URL}/images/default-avatar.jpg`
            }
        } catch (error) {
            console.error('Error fetching profile image:', error);
            return `${process.env.PUBLIC_URL}/images/default-avatar.jpg`;
        }
    };

    // 상단
    const getDisplayName = () => {
        if (!selectedChat || (!selectedChat.member1 && !selectedChat.member2 && !selectedChat.togetherId)) {
            return <div className='chat-window-top-no'>나랑 같이 취할 사람 찾으러 가기!</div>; 
        }
    
        if (selectedChat.togetherId) {
            const nonCurrentMembers = selectedChat.members.filter(member => member !== loggedInUserId);
            const avatarsToShow = nonCurrentMembers.slice(0, 1); 
            const additionalCount = nonCurrentMembers.length - 1; 
    
            return (
                <>
                    <div className="chat-name">
                        {selectedChat.togetherId}
                    </div>
                    <div className="participant-list">
                        <div className="participant-avatar-container">
                            {avatarsToShow.map((member, index) => (
                                <div
                                    key={index}
                                    className="participant-item"
                                    style={{ zIndex: avatarsToShow.length - index }}
                                >
                                    <img
                                        src={member.image}
                                        alt={`member`}
                                        className="participant-img"
                                    />
                                </div>
                            ))}
                            {additionalCount > 0 && (
                                <div className="more-avatars">
                                     + {additionalCount}
                                </div>
                            )}
                        </div>
                        <button className="more" onClick={toggleParticipants}>
                            <MoreVertIcon />
                        </button>
                    </div>
                </>
            );
        }
    
        //const otherUserId = getOtherUserId();
        //if (!otherUserId) {
        //    return <span>상대방 정보 없음</span>;
        //}
        
        //const nickname = getNickname(otherUserId);
       // const profileImage = getProfileImage(otherUserId);
    
       if (activeKey === 'one') {
        return (
            <>
            <div className="d-flex align-items-center">
                <div>
                <img 
                    src={selectedChat.image} 
                    alt={`Profile of ${selectedChat.nickname}`} 
                    className="profile-img rounded-circle" 
                    style={{ width: '40px', height: '40px', marginRight: '10px' }}
                    onClick={() => navigateToUserProfile(selectedChat.id)}
                />
                <span onClick={() => navigateToUserProfile(selectedChat.id)}>{selectedChat.nickname}</span> 
                </div>
            </div>
            <div>
                <button  className="no-style" onClick={() => handleReport(selectedChat)}>🚨</button>
           </div>
           </>
        );
    }
    };

    const getDefaultMessage = () => {
        if (activeKey === 'one') {
            return ['조용하게', '둘이 한 잔?'];
        } else {
            return ['여럿이 먹는 술이', '더 꿀맛!'];
        }
    };
    
    const DefaultMessage = () => {
        const [line1, line2] = getDefaultMessage();
        return (
            <div>
                <>{line1}</>
                <br />
                <>{line2}</>
            </div>
        );
    };

    const toggleParticipants = () => {
        setShowParticipants(!showParticipants);
    };

    const getNickname = (email) => { // 단체채팅 닉네임 가져오기
        const profile = profiles.find(p => p.profile.email === email);
        return profile ? profile.profile.nickname : email;
    };

    const getProfileImage = (email) => { // 단체채팅 이미지 가져오기
        const profile = profiles.find(p => p.profile.email === email);
        return profile && profile.imageBlob.length > 0
           ? profile.imageBlob[0]
            : 'https://www.example.com/default-profile.jpg';
    };

    const getUserId = (email) => {
        const profile = profiles.find(p => p.profile.email === email);
        return profile ? profile.profile.id : null;
    };
    // 날짜 포멧
    const formatDate = (date) => {
        // 예시 형식: 2024년 8월 2일
        return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
    };

    // id로 이동하도록 바꿔야함
    const navigateToUserProfile = (email) => {
        const userId = getUserId(email);
        if (userId) {
            navigate(`/user/${userId}`);
        } else {
            console.error('User ID not found for email:', email);
        }
    };

    const getMessageSenderInfo = (senderId) => {
        const senderProfile = (activeKey === 'one')
            ? profiles.find(p => p.profile.email === senderId)
            : profileData.find(p => p.profile.email === senderId);
    
        return {
            nickname: senderProfile ? senderProfile.profile.nickname : senderId,
            profileImage: senderProfile && senderProfile.imageBlob.length > 0
                ? senderProfile.imageBlob[0]
                : <Avatar
                src={`${process.env.PUBLIC_URL}/images/default-avatar.jpg`}
            />
        };
    };

    const getChatBubbleClasses = (senderId) => {
        return isSender(senderId) ? 'chat-bubble me' : 'chat-bubble you';
    };

    const renderMessagesWithDateSeparators = () => {
        if (!selectedChat || !selectedChat.messages) return null;
    
        console.log("Messages Data:", selectedChat.messages);
    
        let lastDate = null;
    
        return selectedChat.messages.map((message, index) => {
            if (!message) {
                console.error('Undefined message at index:', index);
                return null; // or handle the error as needed
            }
    
            const messageDate = formatDate(message.write_day);
            const showDateSeparator = lastDate !== messageDate;
    
            lastDate = messageDate;
    
            // 프로필 정보를 가져오기
            const senderProfile = profileData[message.sender_id] || {};
            const isSameSenderAsPrevious = index > 0 && selectedChat.messages[index - 1].sender_id === message.sender_id;
    
            return (
                <React.Fragment key={index}>
                    {showDateSeparator && (
                        <div className="date-separator">
                            <div className="messageDate">{messageDate}</div>
                        </div>
                    )}
                    <div className={`chat-bubble-container ${isSender(message.sender_id) ? 'me' : 'you'}`}>
                        {(message.sender_id !== "System") && !isSender(message.sender_id) && !isSameSenderAsPrevious && (
                            <div className="message-info">
                                <img
                                    src={senderProfile.image || `${process.env.PUBLIC_URL}/images/default-avatar.jpg`}
                                    alt={`Profile of ${senderProfile.nickname || 'Unknown'}`}
                                    className="profile-img rounded-circle"
                                    onClick={() => navigateToUserProfile(message.sender_id)}
                                />
                                <span className="nickname" onClick={() => navigateToUserProfile(message.sender_id)}>
                                    {senderProfile.nickname || '왜안떠'}
                                </span>
                            </div>
                        )}
                        <div className={getChatBubbleClasses(message.sender_id)}>
                            {message.message}
                        </div>
                        <span className="chat-time">{formatMessageTime(message.write_day)}</span>
                    </div>
                </React.Fragment>
            );
        });
    };

    //강퇴
    const handleKick = (userEmailObj) => {
        const roomId = selectedChat.roomId;
        const userId = userEmailObj.email;
    
        console.log(roomId);
        console.log(userId);
    
        if (!roomId || !userId) {
            console.error('Invalid roomId or userEmail:', roomId, userId);
            return;
        }
    
        console.log({ roomId, userId });
    
        if (window.confirm('정말로 이 사용자를 단체 채팅방에서 강퇴하시겠습니까?')) {
            dispatch(removeUserFromTogetherChatRoom({ roomId, userId }))
                .then(() => {
                    console.log('단체 채팅방에서 사용자 강퇴 성공');
                    // 단체 채팅방 리스트 다시 불러오기
                    dispatch(fetchTogetherChatRooms({ serverUrl, userId: loggedInUserId }))
                        .then(() => {
                            // 참여자 목록 업데이트
                            setParticipants(prevParticipants => prevParticipants.filter(participant => participant.email !== userId));
                        });
                })
                .catch(err => console.error('단체 채팅방에서 사용자 강퇴 오류:', err));
        }
    };

    const handleReport = (memberId) => {
        // 신고할 유저의 email을 상태로 저장
        setReportedId(memberId.email);
    
        // 신고 모달을 엽니다.
        handleReportModalOpen();
    };

    

    return (
        <>
            <div className="chat-window-top">
                {selectedChat || activeKey === 'together' ? (
                    <div className="top-bar">
                        {getDisplayName()}
                    </div>
                ) : (
                    <div className="default-message">
                        <p className="chat-window-top-no">나랑 같이 취할 사람 찾으러 가기!</p>
                    </div>
                )}
            </div>
    
            {selectedChat && (
                <div className="chat active-chat" data-chat={`person${selectedChat.roomId}`} ref={scrollRef}>
                    {selectedChat.messages && selectedChat.messages.length > 0 ? (
                        renderMessagesWithDateSeparators()
                    ) : (
                        <div className="no-messages">
                            <div>{DefaultMessage()}</div>
                        </div>
                    )}
                    <div ref={scrollRef}></div>
                </div>
            )}

            {showMessageInput && (
                <div className="chat-write d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control flex-grow-1 chat-input"
                        placeholder="메시지를 입력하세요..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                                scrollToBottom();
                            }
                        }}
                    />
                    <ArrowUpwardIcon
                        className="send-icon"
                        fontSize="large"
                        onClick={() => {
                            sendMessage();
                            scrollToBottom();
                        }}
                    />
                </div>
            )}

            {/* 채팅 참여자 모달 */}
            <Modal show={showParticipants} onHide={toggleParticipants}>
                <Modal.Header closeButton>
                    <Modal.Title>채팅 참여자</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedChat && selectedChat.members ? (
                        <ul className="participant-modal-list">
                            {selectedChat.members.map((member, index) => (
                                <li key={index} className="participant-modal-item">
                                    <img
                                        src={member.image}
                                        alt={`Profile of ${getNickname(member)}`}
                                        className="participant-modal-img"
                                        onClick={() => navigateToUserProfile(member)}
                                    />
                                    <span
                                        className="modal-nickname"
                                        onClick={() => navigateToUserProfile(member)} 
                                    >
                                        {member.nickname}
                                    </span>
                                    <div className="participant-modal-actions">

                                        { selectedChat.members[0].email === loggedInUserId && member.email !== loggedInUserId &&(
                                            <button className="no-style" onClick={() => handleKick(member)}>강퇴</button>
                                        )}
                                        {member !== loggedInUserId && member.email !== loggedInUserId &&(
                                            <button className="no-style" onClick={() => handleReport(member)}>🚨</button>
                                        )}
                                    </div>
                                    <br/>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No participants found.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleParticipants}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 신고 모달 */}
            <ReportModal
                show={showReportModal}
                handleClose={handleReportModalClose}
                reportedId={reportedId}
                loggedInUserId={loggedInUserId}
                serverUrl={serverUrl}
            />
        </>
    );
};

export default ChatWindow;