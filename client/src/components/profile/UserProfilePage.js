import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileCard from './ProfileCard';
import { fetchUserProfile } from '../../store/ProfileSlice';
import './userProfilePage.css';
import useAuth from '../../hooks/useAuth';

const UserProfilePage = () => {
    const { email } = useParams();
    const { loggedInUserId } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userProfile = useSelector((state) => state.profile.userProfile);
    const status = useSelector((state) => state.profile.status);
    const error = useSelector((state) => state.profile.error);

    useEffect(() => {
        if (email) {
            console.log(`Fetching user profile for email: ${email}`);
            dispatch(fetchUserProfile(email));
        }
    }, [dispatch, email]);


    const handleGoBack = () => {
        navigate(-1);
    };

    if (status === 'loading') {
        return <p>로딩 중...</p>;
    }

    if (status === 'failed') {
        return <p>오류: {error}</p>;
    }

    if (!userProfile || !userProfile.profile) {
        console.log('UserProfile is not defined or profile is missing');
        return <p>프로필을 찾을 수 없습니다.</p>;
    }

    console.log('UserProfile loaded:', userProfile);

    return (
        <div className="myprofile-container user">
            <div className="user-profile-nickname">{userProfile.profile.nickname}님의 Profile</div>
                <div className="inner-content">
                <div className="profile-container user">
                    <ProfileCard 
                        profileInfo={userProfile} 
                        loggedInUserId={loggedInUserId} 
                        showLikeButton={true} 
                    />
                </div>
            </div>
            <div>
                <button 
                    type="button" 
                    className="btn btn-light back-page-btn" 
                    onClick={handleGoBack}
                >
                    뒤로가기
                </button>
            </div>
        </div>
    );

};

export default UserProfilePage;
