import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';
import profiles from '../../profileData'; 
import ProfileCard from '../profile/ProfileCard'; 
import './tinderCards.css'; 
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

const Match = () => {
    const [profilesList, setProfilesList] = useState(profiles);

    const swiped = (direction, profile) => {
        console.log(`프로필 ${profile.nickname}을(를) ${direction === 'left' ? '왼쪽' : '오른쪽'}으로 스와이프했습니다`);
        // 매치 처리 등의 로직
    };

    const outOfFrame = (profile) => {
        console.log(`${profile.nickname}이(가) 화면을 벗어났습니다`);
        // 화면을 벗어난 프로필 처리 로직
    };

    const handleSwipeLeft = () => {
        if (profilesList.length > 0) {
            const currentProfile = profilesList[0];
            swiped('left', currentProfile);
            const newProfiles = profilesList.slice(1);
            setProfilesList(newProfiles);
        }
    };

    const handleSwipeRight = () => {
        if (profilesList.length > 0) {
            const currentProfile = profilesList[0];
            swiped('right', currentProfile);
            const newProfiles = profilesList.slice(1);
            setProfilesList(newProfiles);
        }
    };

    const handleSwipe = (dir, profile) => {
        swiped(dir, profile);
        const newProfiles = profilesList.slice(1);
        setProfilesList(newProfiles);
    };

    return (
        <div className="tinderCard_container">
            {profilesList.length > 0 ? (
                profilesList.map((profile, index) => (
                    <TinderCard
                        key={profile.id}
                        className="swipe"
                        preventSwipe={['up', 'down']}
                        onSwipe={(dir) => handleSwipe(dir, profile)}
                        onCardLeftScreen={() => outOfFrame(profile)}
                    >
                        <ProfileCard profile={profile} />
                    </TinderCard>
                ))
            ) : (
                <div className="noProfiles">더 이상 표시할 프로필이 없습니다</div>
            )}

            {profilesList.length > 0 && (
                <div className="swipeButtons">
                    <IconButton className="swipeButtons_left" onClick={handleSwipeLeft}>
                        <CloseIcon fontSize='large' className="close_button" />
                    </IconButton>
                    <IconButton className="swipeButtons_right" onClick={handleSwipeRight}>
                        <FavoriteIcon fontSize='large' className="favorite_button" />
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export default Match;