import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileCard from './ProfileCard';
import { fetchOtherProfile, selectOtherProfile} from '../../store/ProfileSlice';
import './userProfilePage.css';
import { AuthContext } from '../login/OAuth';

const UserProfilePage = () => {
    const { email } = useParams();
    const {serverUrl, memberEmail, token} = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const otherProfile = useSelector(selectOtherProfile);
    const otherStatus = useSelector((state) => state.profile.otherStatus);
    const error = useSelector((state) => state.profile.otherError);

    useEffect(() => {
        if (email) {
            console.log(`Fetching user profile for email: ${email}`);
            dispatch(fetchOtherProfile({serverUrl, otherEmail : email, token}));
            // dispatch(fetchUserProfile({serverUrl, memberEmail, token}));
        }
    }, [dispatch, email, serverUrl, token]);


    const handleGoBack = () => {
        navigate(-1);
    };

    if (otherStatus === 'loading') {
        return <p>로딩 중...</p>;
    }

    if (otherStatus === 'failed') {
        return <p>오류: {error}</p>;
    }

    if (!otherProfile || !otherProfile.profile) {
        console.log('UserProfile is not defined or profile is missing');
        return <p>프로필을 찾을 수 없습니다.</p>;
    }

    console.log('UserProfile loaded:', otherProfile);

    return (
        <div className="myprofile-container user">
            <div className="user-profile-nickname">{otherProfile.profile.nickname}님의 Profile</div>
                <div className="inner-content">
                <div className="profile-container user">
                    <ProfileCard 
                        profileInfo={otherProfile} 
                        loggedInUserId={otherProfile.profile.email} 
                        type="other"
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
