import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TinderCard from 'react-tinder-card';
import ProfileCard from '../profile/ProfileCard';
import './tinderCards.css';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { 
  selectProfiles, 
  selectShuffledProfiles, 
  selectCurrentIndex, 
  setShuffledProfiles, 
  updateConfirmedList, 
  updateShowMessages, 
  decrementIndex, 
  resetIndex 
} from '../../store/MatchSlice';

const loggedInUserId = 1;

const TinderCards = () => {
  const dispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const shuffledProfiles = useSelector(selectShuffledProfiles);
  const currentIndex = useSelector(selectCurrentIndex);
  const [showMessages, setShowMessages] = React.useState([]);

  useEffect(() => {
    const filteredProfiles = profiles.filter(profile => 
      profile.location_ok === 1 && 
      profile.match_ok === 1 && 
      !profile.confirmedlist.includes(loggedInUserId) && 
      profile.id !== loggedInUserId
    );

    const shuffled = shuffleArray(filteredProfiles);
    dispatch(setShuffledProfiles(shuffled));
  }, [dispatch, profiles]);

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
    const newShowMessages = [...showMessages];
    newShowMessages[index] = direction === 'right' ? 'LIKE' : 'NOPE';
    setShowMessages(newShowMessages); // 상태 업데이트
    dispatch(updateConfirmedList(profileId));
    dispatch(decrementIndex());
    console.log(`Confirmedlist updated for profileId ${profileId}:`, shuffledProfiles[index].confirmedlist);
  };

  const outOfFrame = (name, idx) => {
    if (idx === 0) {
      dispatch(resetIndex());
    }
  };

  const swipe = async (dir, index) => {
    if (!canSwipe || index < 0 || index >= shuffledProfiles.length || !childRefs[index]?.current) {
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
                <div className="card">
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
                <div className="show-nope">Nope!</div>
                <CloseIcon fontSize='large' className="close_button" />
              </IconButton>
              <IconButton onClick={handleSwipeRight} disabled={!canSwipe}>
                <div className="show-like">Like!</div>
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
