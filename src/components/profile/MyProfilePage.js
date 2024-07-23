import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { fetchUserProfile, selectUserProfile, selectProfileStatus, selectProfileError } from '../../store/ProfileSlice';
import './myProfilePage.css';
import { AuthContext } from '../login/OAuth';
import Swal from 'sweetalert2';


const MyProfilePage = () => {
    
    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
          title: title,
          text: contents,
          icon: icon,
          confirmButtonText: confirmButtonText
        });
    };

    const { serverUrl, memberEmail } = useContext(AuthContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userProfile = useSelector(selectUserProfile);
    const profileStatus = useSelector(selectProfileStatus);
    const profileError = useSelector(selectProfileError);

    useEffect(() => {
        //dispatch(fetchUserProfile({ serverUrl, memberEmail }));
    }, [dispatch, serverUrl, memberEmail]);

    useEffect(() => {
        if (profileError) {
            sweetalert("잘못된 접근 입니다", "", "error", "확인");
            navigate('/');
        }
    }, [profileError, navigate]);

    const handleEditProfile = () => {
        if (userProfile) {
            navigate(`/mypage/edit/${userProfile.profile.id}`);
        }
    };

    return (
        <div className="myprofile-container">
            <div className="user-profile-nickname">My Profile</div>
            <div className="profile-container">
                {profileStatus === 'loading' ? (
                    <p>로딩 중...</p>
                ) : userProfile ? (
                    <ProfileCard profileInfo={userProfile} loggedInUserId={memberEmail} />
                ) : (
                    <p>프로필을 찾을 수 없습니다.</p>
                )}
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