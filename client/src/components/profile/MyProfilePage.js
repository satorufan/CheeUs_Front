import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { fetchUserProfile, selectUserProfile, selectProfileStatus, selectProfileError } from '../../store/ProfileSlice';
import './myProfilePage.css';
import { AuthContext } from '../login/OAuth';
import Swal from 'sweetalert2';
import ProfileSkeleton from '../skeleton/ProfileSkeleton';

const MyProfilePage = () => {
    const { serverUrl, memberEmail, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userProfile = useSelector(selectUserProfile);
    const profileStatus = useSelector(selectProfileStatus);
    const profileError = useSelector(selectProfileError);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchUserProfile({ serverUrl, memberEmail, token }));
    }, [dispatch, serverUrl, memberEmail]);

    useEffect(() => {
        if (profileError) {
            console.log(profileError);
            Swal.fire({
                title: "잘못된 접근 입니다",
                text: "",
                icon: "error",
                confirmButtonText: "확인"
            }).then(()=>{
                navigate('/');
                window.location.reload();
            });
        }
    }, [profileError, navigate]);

    const handleEditProfile = () => {
        if (userProfile) {
            navigate(`/mypage/edit/${userProfile.profile.id}`);
        }
    };

    const handleGoPost = (url) => {
        window.location.href = url;
    };

    const hasScrapPosts = userProfile?.profile.scrap.length > 0;
    const hasMyPosts = userProfile?.profile.myPost.length > 0;

    return (
        <div className="myprofile-container-my">
        <div className="myprofile-container">
            <div className="user-profile-nickname">My Profile</div>
            <div className="userprofile-container">
                <div className="profile-container">
                    {profileStatus === 'loading' ? (
                        <ProfileSkeleton />
                    ) : userProfile ? (
                        <ProfileCard profileInfo={userProfile} loggedInUserId={memberEmail} />
                    ) : (
                        <p>프로필을 찾을 수 없습니다.</p>
                    )}
                </div>
                <div className="my-info-container">
                    {profileStatus === 'loading' ? (
                        <>
                            <div className="my-board" >
                                <div className="my-board-inner"></div>
                            </div>
                            <div className="my-posts"><div className="my-board-inner"></div>
                            </div>
                            </>
                    ) : (
                        <>
                            <div className="my-board">
                                <table>
                                    <thead>
                                        <tr>
                                            <th width="100%">찜한 목록</th>
                                            <th style={{ background: 'white' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {hasScrapPosts ? (
                                            userProfile.profile.scrap.map((post, index) => (
                                                <tr key={`${post.id}-${index}`}>
                                                    <td className="table-type">{post.type}</td>
                                                    <td className="table-title" onClick={() => handleGoPost(post.url)}>{post.title}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2">찜한 목록이 없습니다.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="my-posts">
                                <div classNma="my-posts-my">
                                <table>
                                    <thead>
                                        <tr>
                                            <th width="100%">내가 쓴 글</th>
                                            <th style={{ background: 'white' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {hasMyPosts  ? (
                                        userProfile.profile.myPost.map((post, index) => (
                                            <tr key={`${post.id}-${index}`}>
                                                <td className="table-type">{post.type}</td>
                                                <td className="table-title" onClick={() => handleGoPost(post.url)}>{post.title}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2">찜한 목록이 없습니다.</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="mybtn-container">
                <button
                    type="button"
                    className="btn btn-light edit-myprofile-btn"
                    onClick={handleEditProfile}
                >
                    내 정보 수정
                </button>
            </div>
        </div>
        </div>
    );
};

export default MyProfilePage;
