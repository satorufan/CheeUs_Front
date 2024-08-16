import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileCard from './ProfileCard';
import { fetchOtherProfile, selectOtherProfile } from '../../store/ProfileSlice';
import './userProfilePage.css';
import { AuthContext } from '../login/OAuth';
import ProfileSkeleton from '../skeleton/ProfileSkeleton';
import Spinner from 'react-bootstrap/Spinner';

const UserProfilePage = () => {
    // const { email } = useParams();
    const location = useLocation();
    const email = location.state;
    const { serverUrl, token } = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const otherProfile = useSelector(selectOtherProfile);
    const otherStatus = useSelector((state) => state.profile.otherStatus);
    const error = useSelector((state) => state.profile.otherError);

    useEffect(() => {
        console.log(email);
        if (email) {
            console.log(`Fetching user profile for email: ${email}`);
            dispatch(fetchOtherProfile({ serverUrl, otherEmail: email, token }));
        }
    }, [dispatch, email, serverUrl, token]);

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="userprofile-container">
            <div className="user-profile-nickname">
                {otherStatus === 'loading'
                    ? <Spinner animation="border" variant="dark" /> // 로딩 상태일 때의 텍스트
                    : otherProfile && otherProfile.profile
                        ? `${otherProfile.profile.nickname}님의 Profile`
                        : '프로필을 찾을 수 없습니다.'}
            </div>

            {otherStatus === 'loading' ? (
                <div className="inner-content">
                    <div className="profile-container user">
                        <ProfileSkeleton />
                    </div>
                </div>
            ) : (
                <div className="inner-content">
                    <div className="profile-container user">
                        {otherProfile && otherProfile.profile ? (
                            <ProfileCard
                                profileInfo={otherProfile}
                                loggedInUserId={otherProfile.profile.email}
                                type="other"
                            />
                        ) : (
                            <p>프로필을 찾을 수 없습니다.</p>
                        )}
                    </div>
                </div>
            )}

            {otherStatus === 'failed' && <p>오류: {error}</p>}

            <div className="footer-btn">
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
