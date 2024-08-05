import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { usePosts } from './PostContext';
import PostDetailMap from './PostDetailMap';
import '@toast-ui/editor/dist/toastui-editor.css';
import './DTBinputForm.css';
import 'react-datepicker/dist/react-datepicker.css';
import profileImg from '../images/google.png';
import Swal from 'sweetalert2';
import { fetchUserProfiles} from '../../store/MatchSlice';
import { useDispatch} from 'react-redux';
import { AuthContext } from '../login/OAuth';

// 로그인한 사용자의 아이디를 가져오는 함수
const useAuth = () => {
  const dispatch = useDispatch();
  const { memberEmail, serverUrl, token } = useContext(AuthContext);
  
  useEffect(() => {
    dispatch(fetchUserProfiles({ serverUrl, memberEmail }));
  }, [dispatch, serverUrl, memberEmail]);
  
   
  const loggedInUserId = memberEmail;	//바꾸면 찜하기 보임
  return { loggedInUserId };
};

const PostDetail = () => {
  const { id } = useParams();
  const { posts, deletePost } = usePosts();
  const { loggedInUserId } = useAuth();
  const post = posts.find((post) => post.id === parseInt(id));
  const navigate = useNavigate();
  
  if (!post) return <div>Post not found</div>;
  
  console.log("post.nickname", post.nickname)
  
  const onExitHandler = () => {
    navigate('/dtBoard');
    window.location.reload();
  };

  const onDeleteHandler = () => {
    Swal.fire({
      title: '정말 삭제하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#48088A',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.value) {
        deletePost(post.id);
        Swal.fire('Deleted', '삭제 완료', 'success');
        navigate('/dtBoard');
        window.location.reload();
      }
    });
  };

  const onModifyHandler = () => {
    Swal.fire({
      title: '정말 수정하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#48088A',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.value) {
        navigate(`/dtboard/postModify/${id}`);
      }
    });
  };
  
  return (
    <div className="dt-detail">
      <div className="board-page-top">함께 마셔요</div>
      <div className="detailContainer">
        <div className="dt-detail-left-box">
        <div className="profileContainer" onClick={() => navigate("/mypage")}>
            <div className="profile1">
              <img className="rounded-circle mr-3" src={profileImg} alt="Profile" style={{ width: '40px', height: '40px' }}/>
            </div>
            <div className="profile2">
              <a>{post.nickname}</a>
            </div>
          </div>
          <div className="textareaHeader">
            <div className="textareaBox">{post.title}</div>
          </div>
          <div className="contentContainer2">
              <div className="contentHeader">
              </div>
              <br />
              <div className="contentBox">
                <div className="mapHeader">
            <div className="mapping2">
              장소 | {post.location} ({post.address})
            </div>
            <div className="dateHeader">
              <a>약속시간 : {post.time}</a>
            </div>
          </div>
                <div className="content">{post.content}</div>
              </div>
            </div>
        </div>
        <div className="dt-detail-right-box">
          <div className="detailMapContainer">
            <PostDetailMap
              latitude={post.latitude}
              longitude={post.longitude}
              title={post.title}
              location={post.location}
            />
          </div>
        </div>
      </div>
      <div className="bottomContainer">
        <div className="buttonArea1">
          <button className="backButton" onClick={onExitHandler}>
            <div className="arrowWrap">
              <span className="arrowText">↩ 목록으로</span>
            </div>
          </button>
          <button className="backButton">채팅에 참여하기</button>
        </div>
        <div className="buttonArea2">
          {loggedInUserId === post.author_id ? (
            <>
              <button className="backButton" onClick={onModifyHandler}>
                글 수정
              </button>
              <button className="backButton" onClick={onDeleteHandler}>
                글 삭제
              </button>
            </>
          ) : (
            <button className="backButton">찜하기</button>
          )}
        </div>
      </div>
    </div>
  );
};


export default PostDetail;
