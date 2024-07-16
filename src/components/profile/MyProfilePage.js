import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { fetchUserProfile, selectUserProfile } from '../../store/profileSlice';
import './myProfilePage.css';
import axios from 'axios';
import { AuthContext } from '../login/OAuth';
import { useNavigate } from 'react-router-dom';
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

    const [pageLoad, setLoad] = useState(false);
    const {serverUrl, memberEmail} = useContext(AuthContext);
    const navigate = useNavigate()

    // 로그인 했다고 가정
    const loggedInUserId = 1;

    // 로그인한 사용자의 프로필 정보
    //const loggedInUserProfile = profiles.find(profile => profile.id === loggedInUserId);
    const [loggedInUserProfile, setProfile] = useState();

    // 프로필 불러오기
    useEffect(() => {
        setLoad(true);
    }, []);
    useEffect(()=>{
        if (pageLoad == true) {
            axios.get(serverUrl + "/profile", { params : {
                email : memberEmail
            }})
            .then((res)=>{
                if (res.data) {
                    setProfile(res.data);
                } else {
                    sweetalert("잘못된 접근 입니다", "", "", "확인");
                    navigate('/');
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        }
    },[pageLoad]);

    // if (!loggedInUserProfile) {
    //     return <p>프로필을 찾을 수 없습니다.</p>;
    // }
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const loggedInUserId = 1; 
    // const userProfile = useSelector(selectUserProfile);

    // useEffect(() => {
    //     dispatch(fetchUserProfile(loggedInUserId));
    // }, [dispatch, loggedInUserId]);

    // if (!userProfile) {
    //     return <p>로딩 중...</p>;
    // }

    const handleEditProfile = () => {
        navigate(`/mypage/edit/${loggedInUserId}`); // Navigate to edit profile page
    };

    return (
        <div className="myprofile-container">
            <div className="user-profile-nickname">My Profile</div>
            <div className="profile-container">
                {loggedInUserProfile ?
                <ProfileCard profile={loggedInUserProfile} /> : ""
                }
            </div>
            <div>
            </div>
                {/* <div className="profile-container">
                    <ProfileCard 
                        profile={userProfile} 
                        loggedInUserId={loggedInUserId} 
                        showLikeButton={true} 
                    />
                </div> */}
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