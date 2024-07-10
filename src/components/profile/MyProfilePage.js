import React from 'react';
import ProfileCard from './ProfileCard';
import profiles from '../../profileData';
import './myProfilePage.css';

const MyProfilePage = () => {
    // 로그인 했다고 가정
    const loggedInUserId = 1;

    // 로그인한 사용자의 프로필 정보
    const loggedInUserProfile = profiles.find(profile => profile.id === loggedInUserId);

    if (!loggedInUserProfile) {
        return <p>프로필을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="myprofile-container">
           <div className="user-profile-nickname">My Profile</div>
          <div className="profile-container">
              <ProfileCard profile={loggedInUserProfile} />
          </div>
          <div>
            <button type="button" className="btn btn-light edit-myprofile-btn">내 정보 수정</button>
          </div>
        </div>
    );
};

export default MyProfilePage;