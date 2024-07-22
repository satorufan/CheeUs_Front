import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { usePosts } from './PostContext';
import PostDetailMap from './PostDetailMap';
import '@toast-ui/editor/dist/toastui-editor.css';
import './DTBinputForm.css';
import 'react-datepicker/dist/react-datepicker.css';
import profileImg from '../images/google.png';
import Swal from 'sweetalert2';

// 로그인한 사용자의 아이디를 가져오는 함수
const useAuth = () => {
  // 로그인 정보를 가져오는 로직을 작성해서 대체해야함
  // 임시로 사용자 아이디 고정값으로 가져옴.
  // 어떻게,,연결하지?
  const loggedInUserId = 0;	//바꾸면 찜하기 보임
  return { loggedInUserId };
};

const PostDetail = () => {
  const { id } = useParams();
  const { posts, deletePost } = usePosts();
  const { loggedInUserId } = useAuth();
  const post = posts.find((post) => post.id === parseInt(id));
  const navigate = useNavigate();
  
  if (!post) return <div>Post not found</div>;

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
    <div className="inputContainer">
      <div className="topContainer">
        <div className="textareaHeader">
          <div className="textareaBox">{post.title}</div>
        </div>
        <div className="mapHeader">
          <div className="mapping">
            장소 : {post.location}({post.address})
          </div>
        </div>
      </div>
      <div className="contentContainer">
        <div className="mypageContainer">
          <br />
          <div className="contentHeader">
            <div className="profileContainer">
              <div className="profile1">
                <img className="profileImg" src={profileImg} alt="Profile" />
              </div>
              <div className="profile2">
                <a>{post.authorId}</a>
              </div>
            </div>
            <div className="dateHeader">
              <a>약속시간 : {post.time}</a>
            </div>
          </div>
          <br />
          <div className="contentBox">
            <div className="content">{post.content}</div>
          </div>
        </div>
        <div className="detailMapContainer">
          <PostDetailMap
            latitude={post.latitude}
            longitude={post.longitude}
            title={post.title}
            location={post.location}
          />
        </div>
      </div>
      <div className="bottomContainer">
        <div className="buttonsWrap">
          <div className="buttonArea1">
            <button className="backButton" onClick={onExitHandler}>
              <div className="arrowWrap">
                <BsArrowLeft className="arrow" />
                <span className="arrowText">목록으로</span>
              </div>
            </button>
            <button className="backButton">채팅방</button>
          </div>
          <div className="buttonArea2">
            {loggedInUserId === post.authorId ? (
              <>
                <button className="modifyButton" onClick={onModifyHandler}>
                  글 수정
                </button>
                <button className="deleteButton" onClick={onDeleteHandler}>
                  글 삭제
                </button>
              </>
            ) : (
              <button className="backButton">찜하기</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
