import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { fetchUserProfile, selectUserProfile } from '../../store/profileSlice';
import './myProfilePage.css';

const MyProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedInUserId = 1; 
    const userProfile = useSelector(selectUserProfile);

    useEffect(() => {
        dispatch(fetchUserProfile(loggedInUserId));
    }, [dispatch, loggedInUserId]);

    if (!userProfile) {
        return <p>로딩 중...</p>;
    }

    const handleEditProfile = () => {
        navigate(`/mypage/edit/${loggedInUserId}`); // Navigate to edit profile page
    };

    return (
        <div className="myprofile-container">
            <div className="user-profile-nickname">My Profile</div>
            <div className="profile-container">
                <ProfileCard 
                    profile={userProfile} 
                    loggedInUserId={loggedInUserId} 
                    showLikeButton={true} 
                />
            </div>
            <div>
                <button
                    type="button"
                    className="btn btn-light edit-myprofile-btn"
                    onClick={handleEditProfile}
                >
                    내 정보 수정
                </button>
            </div>
        </div>
    );
};

export default MyProfilePage;