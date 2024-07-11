import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import profiles from '../../profileData';
import './userProfilePage.css';

const UserProfilePage = () => {
    const { id } = useParams();
    const userId = parseInt(id, 10);
    const loggedInUserId = 1;

    const navigate = useNavigate();

    const userProfile = profiles.find(profile => profile.id === userId);
    const userPhotos = userProfile ? userProfile.photos : [];

    if (!userProfile) {
        return <p>프로필을 찾을 수 없습니다.</p>;
    }

    const handleGoBack = () => {
        navigate(-1); 
    };

    return (
        <div className="myprofile-container">
            <div className="user-profile-nickname">{userProfile.nickname}님의 Profile</div>
            <div className="profile-container">
                <ProfileCard profile={userProfile} photos={userPhotos} loggedInUserId={loggedInUserId} showLikeButton={true} />
            </div>
            <div>
                <button type="button" className="btn btn-light back-page-btn" onClick={handleGoBack}>뒤로가기</button>
            </div>
        </div>
    );
};

export default UserProfilePage;