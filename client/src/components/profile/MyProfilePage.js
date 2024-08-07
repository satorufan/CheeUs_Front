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

    const handleGoPost = (id, type) => {
        if (type == "[함께마셔요]") navigate(`/dtboard/post/${id}`);
        // else if (type == "[일반게시판]") navigate(`/dtboard/post/${id}`);
        // else if (type == "[매거진]") navigate(`/dtboard/post/${id}`);
        // else if (type == "[이벤트게시판]") navigate(`/dtboard/post/${id}`);
    }

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
                    {profileStatus === 'loading' ? (
                        <p></p>
                    ) : (<>
                    <div className="my-board">
                        <table>
                            <thead>
                                <tr colspan ='2'>
                                    <th width="30%">찜한 목록</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td></td><td></td></tr>
                                {/* 데이터바인딩 예시 */}
                                {profileStatus === 'succeeded' && userProfile ?. profile.scrap.map(post => (
                                <tr key={post.id}>
                                    <td>{post.type}</td>
                                    <td onClick={()=>handleGoPost(post.id, post.type)}>{post.title}</td>
                                </tr>
                                ))}
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
                                {profileStatus === 'succeeded' && userProfile ?. profile.myPost.map(post => (
                                <tr key={post.id}>
                                    <td>{post.type}</td>
                                    <td onClick={()=>handleGoPost(post.id, post.type)}>{post.title}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div></>)}
                </div>
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