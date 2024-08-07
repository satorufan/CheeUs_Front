import React, { useContext, useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    const loadProfiles = async () => {
      if (profilesStatus === 'loading') {
        return; // 데이터 로딩 중이면 아무 것도 하지 않음
      }

      if (profiles.length > 0) {
        const filteredProfiles = profiles.filter(profile =>
          profile.profile.locationOk === true && 
          profile.profile.matchOk === true && 
          profile.profile.email !== memberEmail
        );
        setCards(filteredProfiles);

        const shuffled = shuffleArray(filteredProfiles);
        dispatch(setShuffledProfiles(shuffled));
      } else {
        // 카드가 없을 때 상태 업데이트
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

  const childRefs = useMemo(
    () => profileCards.map(() => React.createRef()),
    [profileCards]
  );

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
    .then((res)=>{
      if (res.data.matchState === 2) {
        Swal.fire({
          title: '매치 성공!',
          text: '즐거운 대화를 나누어 보아요!',
          icon: 'dark',
          confirmButtonText: '확인'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/chatpage`; // 채팅방 URL로 이동
          }
        });
        sendMessage(res.data);
      }
    });

    setShowMessages(newShowMessages); // 상태 업데이트
    dispatch(updateConfirmedList(profileId));
    dispatch(decrementIndex());
    console.log(`Confirmedlist updated for profileId ${profileId}:`, shuffledProfiles[index].confirmedlist);
  };

  // 채팅방 생성 + 시스템 메시지 전송
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

    const newMessage = {
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
      await axios.post(sendMessage, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const outOfFrame = (name, idx) => {
    if (idx === 0) {
      dispatch(resetIndex());
    }
  };

  const swipe = async (dir, index) => {
    if (!canSwipe || index < 0 || index >= profileCards.length || !childRefs[index]?.current) {
      return;
    }

    await childRefs[index].current.swipe(dir);
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
      {profileCards.length === 0 ? (
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
                  ref={childRefs[index]}
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
