import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { fetchUserProfile, selectUserProfile, selectProfileStatus, selectProfileError } from '../../store/ProfileSlice';
import './myProfilePage.module.css';
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

    const { serverUrl, memberEmail, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userProfile = useSelector(selectUserProfile);
    const profileStatus = useSelector(selectProfileStatus);
    const profileError = useSelector(selectProfileError);

    useEffect(() => {
        dispatch(fetchUserProfile({ serverUrl, memberEmail, token }));
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
            <div className="userprofile-container">
                <div className="profile-container">
                    {profileStatus === 'loading' ? (
                        <p>로딩 중...</p>
                    ) : userProfile ? (
                        <ProfileCard profileInfo={userProfile} loggedInUserId={memberEmail} />
                    ) : (
                        <p>프로필을 찾을 수 없습니다.</p>
                    )}
                </div>
                <div className="my-info-container">
                    <div className="my-board">
                        <table>
                            <thead>
                                <tr colspan ='2'>
                                    <th width="30%">찜한 목록</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 데이터바인딩 예시 */}
                                {/* likedPosts.map(post => (
                                <tr key={post.id}>
                                    <td>{post.title}</td>
                                    <td>{post.content}</td>
                                </tr>
                                )) */}
                                <tr>
                                    <td>게시물 1</td>
                                    <td>내용 1</td>
                                </tr>
                                <tr>
                                    <td>게시물 2</td>
                                    <td>내용 2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="my-posts">
                        <table>
                            <thead>
                                <tr>
                                    <th width="30%">내가 쓴 글</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* myPosts.map(post => (
                                <tr key={post.id}>
                                    <td>{post.title}</td>
                                    <td>{post.content}</td>
                                </tr>
                                )) */}
                                <tr>
                                    <td>게시물 1</td>
                                    <td>내용 1</td>
                                </tr>
                                <tr>
                                    <td>게시물 2</td>
                                    <td>내용 2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>``
            </div>
            <div>
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
    );
};

export default MyProfilePage;