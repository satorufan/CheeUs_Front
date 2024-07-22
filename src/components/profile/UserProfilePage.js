import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileCard from './ProfileCard';
import { fetchUserProfile } from '../../store/ProfileSlice';
import './userProfilePage.css';

const UserProfilePage = () => {
    const { id } = useParams();
    const userId = parseInt(id, 10);
    const userEmail = useLocation();
    const loggedInUserId = 1; // 가상 로그인
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userProfile = useSelector((state) => state.profile.userProfile);
    const status = useSelector((state) => state.profile.status);
    const error = useSelector((state) => state.profile.error);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserProfile(userId));
        }
    }, [dispatch, userId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (status === 'loading') {
        return <p>로딩 중...</p>;
    }

    if (status === 'failed') {
        return <p>오류: {error}</p>;
    }

    if (!userProfile) {
        return <p>프로필을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="myprofile-container">
            <div className="user-profile-nickname">{userProfile.nickname}님의 Profile</div>
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
