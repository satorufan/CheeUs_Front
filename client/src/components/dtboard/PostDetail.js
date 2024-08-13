import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from './PostContext';
import PostDetailMap from './PostDetailMap';
import '@toast-ui/editor/dist/toastui-editor.css';
import './DTBinputForm.css';
import 'react-datepicker/dist/react-datepicker.css';
import profileImg from '../images/noimage.jpg';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import { fetchUserProfiles} from '../../store/MatchSlice';
import { useDispatch, useSelector} from 'react-redux';
import { AuthContext } from '../login/OAuth';
import { selectUserProfile } from '../../store/ProfileSlice';
import axios from 'axios';
import { fetchTogetherChatRooms } from '../../store/ChatSlice';
import useToProfile from '../../hooks/useToProfile';
import UseAuthorImages from '../images/UseAuthorImage';

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { memberEmail, serverUrl, token } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  // const [like, setLike] = useState(false);
  const [authorInfo, setAuthorInfo] = useState();
  const [isScrapped, setIsScrapped] = useState(false);
  const { posts, setPosts, deletePost, addScrap, checkScrap, userLiked, toggleLike } = usePosts();
  const [currentPost, setCurrentPost] = useState(null);
  const post = posts.find((post) => post.id === parseInt(id));
  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  const navigateToUserProfile = useToProfile();
  const authorImages = UseAuthorImages(posts);
  const [loadedImages, setLoadedImages] = useState({});

  // 유저가 해당 게시글 채팅방에 참여중인지 확인
  const rooms = useSelector(state => state.chat.togetherChatRooms);
  const isJoined = rooms ?. filter(room => 
    room.roomId == id && room.members.map(member=>
    member.email == memberEmail)).length > 0 ? true : false;

    const handleImageLoad = (authorId) => {
      setLoadedImages(prevState => ({ ...prevState, [authorId]: true }));
    };

    useEffect(() => {
      const checkUserLiked = async () => {
          if (post) {
              try {
                  console.log("liked 테스트중-------------");
                  const likedValue = await userLiked(serverUrl, post.id, memberEmail);
                  console.log("값은", likedValue);
                  
                  setIsLiked(likedValue); // likedValue를 setIsLiked에 넣어 상태 업데이트
              } catch (error) {
                  console.error("Error checking if user liked the post:", error);
              }
          }
      };
  
      checkUserLiked();
  }, [post, serverUrl, memberEmail]); // 의존성 배열에 필요한 값들 추가
  
  useEffect(() => {
      if (post) {
          setCurrentPost(post);
      }
  }, [post]);

  useEffect(() => {
    if (post) {
      const incrementViewCount = async () => {
        try {
          const response = await axios.put(`${serverUrl}/dtBoard/incrementView/${post.id}`, {}, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            withCredentials: true,
          });

          if (response.data.success) {
            setCurrentPost(prevPost => ({
              ...prevPost,
              views: response.data.updatedViewCount
            }));
          }
        } catch (error) {
          console.error('Error incrementing view count:', error);
        }
      };

      incrementViewCount();
    }
  }, [serverUrl, token]);

  

  /*
  // 게시글 정보를 가져오고 조회수를 증가시키는 useEffect
  useEffect(() => {
    const fetchPostAndIncrementView = async () => {
      if (id) {
        try {
          // 게시글 정보 가져오기
          const postResponse = await axios.get(`${serverUrl}/dtBoard/post/${id}`);
          const fetchedPost = postResponse.data;
          setCurrentPost(fetchedPost);

          // 조회수 증가
          const viewResponse = await axios.post(`${serverUrl}/dtBoard/incrementView/${id}`, {}, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            withCredentials: true,
          });

          if (viewResponse.data.success) {
            setCurrentPost(prevPost => ({
              ...prevPost,
              views: viewResponse.data.updatedViewCount
            }));

            // 전역 상태의 게시글 목록 업데이트
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === parseInt(id) ? { ...post, views: viewResponse.data.updatedViewCount } : post
            ));
          }
        } catch (error) {
          console.error('게시글 정보를 가져오거나 조회수를 증가시키는 중 오류 발생:', error);
        }
      }
    };

    fetchPostAndIncrementView();
  }, [id, serverUrl, token, setPosts]);

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
              const isPostScrapped = await checkScrap(serverUrl, memberEmail, post.id, token, 2);
              setIsScrapped(isPostScrapped);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
        }
    };
    fetchData();
  }, [dispatch, serverUrl, memberEmail, token]);
   */

  /*
  useEffect(() => {
    if (post) {
      // 조회수 증가 요청
      const incrementViewCount = async () => {
        try {
          await axios.post(`${serverUrl}/dtboard/incrementView/${post.id}`, {}, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            withCredentials: true,
          });
        } catch (error) {
          console.error('Error incrementing view count:', error);
        }
      };
      
      incrementViewCount();
    }
  }, [post, serverUrl, token]);
*/

    

  /*
  useEffect(() => {
    setCurrentPost(post);
    if (post) {
      setLike(post.like > 0);
    }
  }, [post]);
*/

  /*
    // 현재 포스트의 좋아요 확인
  useEffect(() => {
    const checkIfLiked = async () => {
      if (post && serverUrl && memberEmail && token) {  // 모든 필요한 값이 존재하는지 확인
        try {
          const response = await axios.get(`${serverUrl}/dtBoard/post/${post.id}`,
              {
            params: { postId: post.id, userEmail: memberEmail },
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            withCredentials: true,
          });
          console.log(">>>>나와라 like 갯수 로그<<<< " + response.data.like);
          setLike(response.data.like);
        } catch (error) {
          console.error('좋아요 숫자확인 에러낫슈', error);
        }
      }
    };

    checkIfLiked();
  }, [post, serverUrl, memberEmail, token]);
  */

  /*
  const handleLikeClick = async () => {
    if (currentPost) {
      try {
        const response = await axios.put(`${serverUrl}/toggleLike/${currentPost.id}`, null, {
          params: { authorId: memberEmail },
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const newLikeCount = response.data.updatedLikeCount;

        setLike(prevLike => !prevLike);
        // 현재 포스트 업데이트
        setCurrentPost(prevPost => ({...prevPost, like: newLikeCount}));
      } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error);
      }
    }
  };
  */

  const handleLikeClick = async () => {
    if (currentPost) {
      try {
        const { updatedLikeCount, isLiked } = await toggleLike(serverUrl, currentPost.id, memberEmail);
        setCurrentPost(prevPost => ({...prevPost, like: updatedLikeCount}));
        setIsLiked(!isLiked);
      } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error);
      }
      /*
      try {
        const newLikeCount = await toggleLike(serverUrl, currentPost.id, memberEmail);
        setLike(!like);
        // 현재 포스트 업데이트
        setCurrentPost(prevPost => ({...prevPost, like: newLikeCount}));
      } catch (error) {
        console.error('좋아요 처리 중 오류 발생:', error);
      }
       */
    }
  };


  /*
  const handleLikeClick = async () => {
    if (post) {
      await toggleLike(serverUrl, memberEmail, post.id, token);
      setLike(!like); // 좋아요 누르면 ui 바뀜
    }
  };
   */

  if (!currentPost) return <div>Post not found</div>;
  
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
    const scrapMessage = await addScrap(serverUrl, memberEmail, id, post.title, token, window.location.href, 2 );
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

  if (!memberEmail) {
    return (
      <div className="permissionMessage" >
          <div>로그인 후 이용할 수 있습니다.</div>
      </div>
    );
  }

  if (!currentPost) return <div>로딩 중...</div>;

  return (
    <div className="dt-detail">
    <div className="board-page-top">함께 마셔요</div>
    <div className="detailContainer">
      <div className="dt-detail-left-box">
      <div className="profileContainer">
          <div className="profile1">
            <img className="rounded-circle mr-3" onClick={()=>navigateToUserProfile(post.author_id)} src={authorImages[post.author_id]} alt="Profile" style={{ width: '40px', height: '40px' }}/>
          </div>
          <div className="profile2">
            <a className = "DTprofileName" onClick={()=>navigateToUserProfile(post.author_id)}>{post.nickname}</a>
          </div>
        </div>
        <div className="textareaHeader">
          <div className="textareaBox">{post.title}</div>
          <div className='textareaBoxRight'>
          	<div className = 'iconBox'>
          		<Favorite 
	              className='likeIcon' 
	              color={isLiked ? 'error' : 'action'}
	              onClick={handleLikeClick} 
            	/>
            	<span>{currentPost?.like}</span>
          		<Visibility className='viewIcon'/>
          		<span>{post.views}</span>
          	</div>
          	<div>
          	</div>
          </div>
        </div>
        <div className="contentContainer">
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
