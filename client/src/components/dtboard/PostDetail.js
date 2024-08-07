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
import { useDispatch, useSelector} from 'react-redux';
import { AuthContext } from '../login/OAuth';
import { selectUserProfile } from '../../store/ProfileSlice';
import axios from 'axios';
import { fetchTogetherChatRooms } from '../../store/ChatSlice';

// // 로그인한 사용자의 아이디를 가져오는 함수
// const useAuth = (author) => {
//   const dispatch = useDispatch();
//   const { memberEmail, serverUrl, token } = useContext(AuthContext);
//   var authorInfo;
  
//   useEffect(() => {
//     dispatch(fetchUserProfiles({ serverUrl, memberEmail }));
//     dispatch(fetchTogetherChatRooms({serverUrl, userId : memberEmail}));
//     axios.get(serverUrl + '/match/chattingPersonal', {params : {
//       email : author
//     }}).then((res)=>{
//       console.log(res)
//       authorInfo = res.data
//     });
//   }, [dispatch, serverUrl, memberEmail, author]);
  
//   const loggedInUserId = memberEmail;	//바꾸면 찜하기 보임
  
//   return { loggedInUserId, authorInfo };
// };

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { memberEmail, serverUrl, token } = useContext(AuthContext);

  const [authorInfo, setAuthorInfo] = useState();
  const [isScrapped, setIsScrapped] = useState(false);
  const { posts, deletePost, addScrap, checkScrap } = usePosts();
  const post = posts.find((post) => post.id === parseInt(id));
  // const { loggedInUserId, authorInfo } = useAuth(post ?. author_id);
  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  // 유저가 해당 게시글 채팅방에 참여중인지 확인
  const rooms = useSelector(state => state.chat.togetherChatRooms);
  const isJoined = rooms ?. filter(room => 
    room.roomId == id && room.members.map(member=>
    member.email == memberEmail)).length > 0 ? true : false;
  
  useEffect(() => {
    dispatch(fetchUserProfiles({ serverUrl, memberEmail }));
    dispatch(fetchTogetherChatRooms({serverUrl, userId : memberEmail}));
    const fetchData = async () => {
      if (post) {
          try {
              // Fetch author info
              const authorResponse = await axios.get(`${serverUrl}/match/chattingPersonal`, {
                  params: { email: post.author_id }
              });
              setAuthorInfo({
                  email: authorResponse.data.email,
                  image: `data:${authorResponse.data.imageType};base64,${authorResponse.data.imageBlob}`
              });

              // Check if post is scrapped
              const isPostScrapped = await checkScrap(serverUrl, memberEmail, post.id, token);
              setIsScrapped(isPostScrapped);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
        }
    };
    fetchData();
  }, [dispatch, serverUrl, memberEmail, token]);

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

  const onScrapHandler = async () => {
    const scrapMessage = await addScrap(serverUrl, memberEmail, id, post.title, token, window.location.href );
    Swal.fire({
      title: `${scrapMessage}!`,
      icon: '',
      showCancelButton: true,
      confirmButtonColor: '#48088A',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    })
    setIsScrapped(!isScrapped);
  };

  const handleClickJoinBtn = () => {
    Swal.fire({
      title: isJoined ? '현재 참여중인 채팅방입니다.' : '채팅에 참여하였습니다.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#48088A',
      confirmButtonText: '채팅방으로 이동',
      cancelButtonText: '취소',
    }).then((result) => {
      console.log(result);
      if (result.value) {
        navigate(`/chatpage`);
      }
    });
  }

  const joinChatRoom = async () => {
    const join = {
      room_id : id,
      member : userProfile.profile.email
    }
    const newMessage = {
      sender_id: 'System',
      message: userProfile.profile.nickname + '님이 입장하였습니다.',
      write_day: new Date().toISOString(),
      read: [],
      room_id : parseInt(id, 10)
    };

    const joinRoom = 'http://localhost:8889/api/joinTogetherRoom';
    const sendMessage = 'http://localhost:8889/api/togetherMessages';

    await axios.post(joinRoom, join).then(res=>console.log(res)).catch(err=>console.log(err));
    await axios.post(sendMessage, newMessage);

    handleClickJoinBtn();

  };
  
  return (
    <div className="dt-detail">
    <div className="board-page-top">함께 마셔요</div>
    <div className="detailContainer">
      <div className="dt-detail-left-box">
      <div className="profileContainer" onClick={() => navigate("/userprofile/"+authorInfo.email)}>
          <div className="profile1">
            <img className="rounded-circle mr-3" src={authorInfo ? authorInfo.image : profileImg} alt="Profile" style={{ width: '40px', height: '40px' }}/>
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
              <div className="content">{post.content}</div>
            </div>
          </div>
      </div>
      <div className="dt-detail-right-box">
        <div className="mapHeader-detail">
          <div className="mapping2">
            장소 | {post.location} ({post.address})
          </div>
          <div className="dateHeader">
            <a>시간 | {post.time}</a>
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
    </div>
    <div className="bottomContainer">
      <div className="buttonArea1">
        <button className="backButton" onClick={onExitHandler}>
          <div className="arrowWrap">
            <span className="arrowText">↩ 목록으로</span>
          </div>
        </button>
        <button className="backButton" onClick={joinChatRoom} hidden={isJoined}>채팅에 참여하기</button>
        <button className="backButton" onClick={handleClickJoinBtn} hidden={!isJoined}>현재 참여중</button>
      </div>
      <div className="buttonArea2">
        {memberEmail === post.author_id ? (
          <>
            <button className="backButton" onClick={onModifyHandler}>
              글 수정
            </button>
            <button className="backButton" onClick={onDeleteHandler}>
              글 삭제
            </button>
          </>
        ) : (
          <>
            <button className="backButton" onClick={onScrapHandler} hidden={isScrapped}>찜하기</button>
            <button className="backButton" onClick={onScrapHandler} hidden={!isScrapped}>찜삭제</button>
          </>
        )}
      </div>
    </div>
  </div>
  );
};

export default PostDetail;
