import React, { useState, useMemo, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import ProfileCard from '../profile/ProfileCard';
import './tinderCards.css';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

const loggedInUserId = 1;

const TinderCards = ({ profiles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState(null);
  const [showMessages, setShowMessages] = useState([]);
  const [shuffledProfiles, setShuffledProfiles] = useState([]);

  useEffect(() => {
    // 로그인 사용자를 제외한 매칭 가능한 프로필 필터링
    // 위치 정보 제공 동의 및 매칭 동의가 필요한 프로필 필터링
    const filteredProfiles = profiles.filter(profile =>
      profile.location_ok === 1 && 
      profile.match_ok === 1 && 
      !profile.confirmedlist.includes(loggedInUserId) && 
      profile.id !== loggedInUserId
    );

    if (filteredProfiles.length === 0) {
      setCurrentIndex(-1);
      setShuffledProfiles([]);
      setShowMessages([]);
      return;
    }

    // 프로필 배열 섞은 후 상태 업데이트
    const shuffled = shuffleArray(filteredProfiles);
    setShuffledProfiles(shuffled);
    setShowMessages(Array(shuffled.length).fill(''));
    setCurrentIndex(shuffled.length);
  }, []);

  useEffect(() => {
    console.log('currentIndex:', currentIndex);
  }, [currentIndex]);

  // 배열 섞기 함수
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 각 카드 레퍼런스 생성
  const childRefs = useMemo(
    () => shuffledProfiles.map(() => React.createRef()),
    [shuffledProfiles]
  );

  const canSwipe = currentIndex >= 0;

  // 카드 스와이프 이벤트 처리
  const swiped = (direction, profileId, index) => {
    setLastDirection(direction);

    // 새로운 상태 메시지 배열 생성 및 업데이트
    const newShowMessages = [...showMessages];
    if (direction === 'right') {
      newShowMessages[index] = 'LIKE';
    } else if (direction === 'left') {
      newShowMessages[index] = 'NOPE';
    }
    setShowMessages(newShowMessages);

    // 프로필의 confirmedlist 업데이트 (서버로 데이터 보내기 구현 필요)
    updateConfirmedList(profileId);
    setCurrentIndex(prevIndex => prevIndex - 1);
  };

  // confirmedlist 업데이트 함수 (서버로 데이터 보내기 구현 필요)
  const updateConfirmedList = (profileId) => {
    const updatedProfiles = shuffledProfiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          confirmedlist: [...profile.confirmedlist, loggedInUserId]
        };
      }
      return profile;
    });
    setShuffledProfiles(updatedProfiles);
  };

  // 카드가 화면을 벗어난 경우 처리
  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
    if (idx === 0) {
      setCurrentIndex(-1); 
    }
  };

// 스와이프 실행 함수 (async로 처리)
const swipe = async (dir, index) => {
  if (!canSwipe || index < 0 || index >= shuffledProfiles.length || !childRefs[index]?.current) {
    console.log(`Cannot swipe at index: ${index}.`);
    return;
  }

  try {
    await childRefs[index].current.swipe(dir);
    // 프로필의 confirmedlist 업데이트 (서버로 데이터 보내기 구현 필요)
    updateConfirmedList(shuffledProfiles[index].id);

    setShuffledProfiles(prevProfiles => {
      const updatedProfiles = [...prevProfiles];
      updatedProfiles[index] = {
        ...updatedProfiles[index],
        confirmedlist: [...updatedProfiles[index].confirmedlist, loggedInUserId]
      };
      return updatedProfiles;
    });
  } catch (error) {
    console.error('Error while swiping: ', error);
  }
};

// 왼쪽으로 스와이프 처리 함수
const handleSwipeLeft = async () => {
  if (!canSwipe || currentIndex <= 0) return; 

  const index = currentIndex - 1; 
  await swipe('left', index);
};
  
// 오른쪽으로 스와이프 처리 함수
const handleSwipeRight = async () => {
  if (!canSwipe || currentIndex <= 0) return; 

  const index = currentIndex - 1; 
  await swipe('right', index);
};

    const handleCardClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

  return (
    <div className="tinderCard_container">
      {currentIndex === -1 ? (
        <div className="noMoreCardsMessage">
          <p>매칭 할 카드가 없습니다.</p>
          <p>함께 마셔요 게시판에는 있을지도~?</p>
        </div>
      ) : (
        <>
          <div className='cardContainer'>
            <div className="show-like">LIKE!</div>
            <div className="show-nope">NOPE!</div>
            {shuffledProfiles.map((profile, index) => (
              <TinderCard
                ref={childRefs[index]}
                className='swipe'
                key={profile.id}
                onSwipe={(dir) => swiped(dir, profile.id, index)}
                onCardLeftScreen={() => outOfFrame(profile.id, index)}
                preventSwipe={['up', 'down']}
              >
                <div className="card" onClick={handleCardClick}>
                  <ProfileCard profile={profile} />
                  {showMessages[index] && (
                    <div className={`infoText ${showMessages[index] === 'LIKE' ? 'like' : 'nope'}`}>
                      {showMessages[index]}
                    </div>
                  )}
                </div>
              </TinderCard>
            ))}
          </div>
          {canSwipe && (
            <div className='swipeButtons'>
              <IconButton onClick={handleSwipeLeft} disabled={!canSwipe}>
                <CloseIcon fontSize='large' className="close_button" />
              </IconButton>
              <IconButton onClick={handleSwipeRight} disabled={!canSwipe}>
                <FavoriteIcon fontSize='large' className="favorite_button" />
              </IconButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TinderCards;