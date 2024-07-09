import React, { useState, useMemo, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import profiles from '../../profileData';
import ProfileCard from '../profile/ProfileCard';
import './tinderCards.css';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

const loggedInUserId = 1;

const Match = () => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [lastDirection, setLastDirection] = useState(null);
  const [showMessages, setShowMessages] = useState([]);
  const [shuffledProfiles, setShuffledProfiles] = useState([]);

  useEffect(() => {
    const filteredProfiles = profiles.filter(profile =>
      !profile.confirmedlist.includes(loggedInUserId) && profile.id !== loggedInUserId
    );

    if (filteredProfiles.length === 0) {
      setCurrentIndex(-1);
      setShuffledProfiles([]);
      setShowMessages([]);
      return;
    }

    const shuffled = shuffleArray(filteredProfiles);
    setShuffledProfiles(shuffled);
    setShowMessages(Array(shuffled.length).fill(''));
    setCurrentIndex(shuffled.length - 1);
  }, []);

  useEffect(() => {
    console.log('currentIndex:', currentIndex);
  }, [currentIndex]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const childRefs = useMemo(
    () => shuffledProfiles.map(() => React.createRef()),
    [shuffledProfiles]
  );

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, profileId, index) => {
    setLastDirection(direction);

    const newShowMessages = [...showMessages];
    if (direction === 'right') {
      newShowMessages[index] = 'LIKE';
    } else if (direction === 'left') {
      newShowMessages[index] = 'NOPE';
    }
    setShowMessages(newShowMessages);

    updateConfirmedList(profileId);
    setCurrentIndex(prevIndex => prevIndex - 1);
  };

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

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
    if (idx === 0) {
      setCurrentIndex(-1); // 마지막 카드 처리 후 상태 업데이트
    }
  };

  const swipe = async (dir, index) => {
    if (!canSwipe || index < 0 || index >= shuffledProfiles.length || !childRefs[index]?.current) {
      console.log(`Cannot swipe at index: ${index}.`);
      return;
    }

    try {
      await childRefs[index].current.swipe(dir);
    } catch (error) {
      console.error('Error while swiping: ', error);
    }
  };

  const handleSwipeLeft = async () => {
    if (!canSwipe || currentIndex >= shuffledProfiles.length) return;
    if (childRefs[currentIndex]?.current) {
      await swipe('left', currentIndex);
    }
  };
  
  const handleSwipeRight = async () => {
    if (!canSwipe || currentIndex >= shuffledProfiles.length) return;
    if (childRefs[currentIndex]?.current) {
      await swipe('right', currentIndex);
    }
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

export default Match;
