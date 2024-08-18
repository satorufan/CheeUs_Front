import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TinderCard from 'react-tinder-card';
import ProfileCard from '../profile/ProfileCard';
import './tinderCards.css';
import IconButton from '@mui/material/IconButton';
import ProfileSkeleton from '../skeleton/ProfileSkeleton';
import { 
  selectProfiles, 
  selectShuffledProfiles, 
  selectCurrentIndex, 
  setShuffledProfiles, 
  updateConfirmedList, 
  decrementIndex, 
  resetIndex,
  selectStatus, 
} from '../../store/MatchSlice';
import { AuthContext } from '../login/OAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import useSocketIo from '../../hooks/useSocketIo';

const TinderCards = () => {
  const dispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const profilesStatus = useSelector(selectStatus);
  const [profileCards, setCards] = useState([]);
  const shuffledProfiles = useSelector(selectShuffledProfiles);
  const currentIndex = useSelector(selectCurrentIndex);
  const [showMessages, setShowMessages] = React.useState([]);
  const { memberEmail, serverUrl } = useContext(AuthContext);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const socket = useSocketIo('one', null, memberEmail);
  const childRefs = useRef([]); // 리랜더링 돼도 참조 유지

  useEffect(() => {
    const loadProfiles = async () => {
      if (profilesStatus === 'loading') {
        return; 
      }

      if (profiles.length > 0) {
        const filteredProfiles = profiles.filter(profile =>
          profile.profile.locationOk === true && 
          profile.profile.matchOk === true && 
          profile.profile.email !== memberEmail
        );

        const shuffled = shuffleArray(filteredProfiles);
        setCards(shuffled); 
        dispatch(setShuffledProfiles(shuffled)); 
      } else {
        setCards([]);
        dispatch(setShuffledProfiles([]));
      }

      setIsDataLoaded(true); // 데이터 로딩 완료 상태로 업데이트
    };

    loadProfiles();
  }, [dispatch, profiles, profilesStatus, memberEmail]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, profileId, index) => {
    const newShowMessages = [...showMessages];
    newShowMessages[index] = direction === 'right' ? 'LIKE' : 'NOPE';

    // 백엔드에서 처리
    const formData = new FormData();
    formData.append('member1', memberEmail);
    formData.append('member2', profileId);
    formData.append('type', direction);
    axios.post(serverUrl + "/match/swipe", formData)
    .then((res) => {
      if (res.data.matchState === 2) {
        Swal.fire({
          title: '매치 성공!',
          text: '즐거운 대화를 나누어 보아요!',
          icon: 'dark',
          cancelButtonText: '머물기',
          confirmButtonText: '채팅방으로',
          showCancelButton: true, 
          cancelButtonColor: 'dark'
          }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/chatpage`; // 채팅방 URL로 이동
          } 
        });
        sendMessage(res.data);
      }
    });

    setShowMessages(newShowMessages); // 상태 업데이트
    //dispatch(updateConfirmedList(profileId));
    dispatch(decrementIndex());
  };

  const sendMessage = async (data) => {
    if (!memberEmail) {
      console.log('Cannot send message: No selected chat, empty input, or missing user ID.');
      return;
    }

    const newRoom = {
      id: data.id,
      member1: data.member1,
      member2: data.member2,
      match: data.matchState
    };

    const dbMessage = {
      sender_id: 'System',
      message: '매칭 성공! 즐거운 대화를 나누어 보아요',
      write_day: new Date().toISOString(),
      read: 0,
      chat_room_id: data.id
    };

    try {
      const createRoom = 'http://localhost:8889/api/createOneoneRoom';
      const sendMessage = 'http://localhost:8889/api/messages';
      await axios.post(createRoom, newRoom);
      await axios.post(sendMessage, dbMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // 소켓으로 보낼 메시지
    const socketMessage = {
      ...dbMessage,
        member: [data.member1, data.member2].filter(member => member !== memberEmail)
   };
   
      // 소켓으로 메시지 전송
      if (socket.current) {
        socket.current.emit('sendMessage', socketMessage);
    } else {
        console.error('Socket is not connected.');
    }
  };

  const outOfFrame = (name, idx) => {
    if (idx === 0) {
      dispatch(resetIndex());
    }
  };

  const swipe = async (dir, index) => {
    if (!canSwipe || index < 0 || index >= profileCards.length || !childRefs.current[index]?.swipe) {
      return;
    }
  
    try {
      await childRefs.current[index].swipe(dir);
    } catch (error) {
      console.error('Error while swiping:', error);
    }
  };

  const handleSwipeLeft = async () => {
    if (!canSwipe || currentIndex <= 0) return;
    const index = currentIndex - 1;
    await swipe('left', index);
  };

  const handleSwipeRight = async () => {
    if (!canSwipe || currentIndex <= 0) return;
    const index = currentIndex - 1;
    await swipe('right', index);
  };

  if (!isDataLoaded) {
    return (
      <div className='skeleton-card-container'>
        <div className="profile-container-tinder">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="tinderCard_container">
      {profileCards.length === 0 || !canSwipe ? (
        <div className="noMoreCardsMessage">
          <div className="noMessage">
            <div>매칭 할 카드가 없습니다.</div>
            <span style={{ color: '#FF6B6B' }}>함께 마셔요</span><span> 게시판도 둘러보세요!</span>
          </div>
        </div>
      ) : (
        <>
          <div className="cardButtonContainer">
            <div className="swipeButton">
              {canSwipe && (
                <IconButton onClick={handleSwipeLeft} disabled={!canSwipe}>
                  <div className="buttonContent">
                    <div className="show-nope">Nope!</div>
                    <div className="close_button">X</div>
                  </div>
                </IconButton>
              )}
            </div>
            <div className="cardContainer">
              {profileCards.map((profile, index) => (
                <TinderCard
                  ref={(el) => (childRefs.current[index] = el)}
                  className="swipe"
                  key={profile.profile.email}
                  onSwipe={(dir) => swiped(dir, profile.profile.email, index)}
                  onCardLeftScreen={() => outOfFrame(profile.profile.email, index)}
                  preventSwipe={['up', 'down']}
                >
                  <div className="card">
                    <div className="card-in">
                      <ProfileCard profileInfo={profile} />
                      {showMessages[index] && (
                        <div className={`infoText ${showMessages[index] === 'LIKE' ? 'like' : 'nope'}`}>
                          {showMessages[index]}
                        </div>
                      )}
                    </div>
                  </div>
                </TinderCard>
              ))}
            </div>
            <div className="swipeButton">
              {canSwipe && (
                <IconButton onClick={handleSwipeRight} disabled={!canSwipe}>
                  <div className="buttonContent">
                    <div className="show-like">Like!</div>
                    <div className="favorite_button">♥</div>
                  </div>
                </IconButton>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TinderCards;
