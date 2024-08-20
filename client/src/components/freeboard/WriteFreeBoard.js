import React, { useState, useRef, useContext, useEffect } from 'react'; // useEffect 추가
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
import { addBoard, selectMaxId } from '../../store/BoardSlice';
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';
import { AuthContext } from '../login/OAuth'; 
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
import BoardDetailTop from '../board/BoardDetailTop';
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase/firebase";
import Spinner from 'react-bootstrap/Spinner';

const WriteFreeBoard = () => {
  const [title, setTitle] = useState('');
  const editorRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serverUrl, memberEmail, token } = useContext(AuthContext); // 현재 사용자 정보 가져오기
  const userProfile = useSelector(selectUserProfile); // Redux의 selectUserProfile selector를 사용하여 userProfile 가져옴
  const boards = useSelector(state => state.board.boards); // boards 변수를 Redux 상태에서 가져옴
  const maxId = useSelector(selectMaxId); // maxId 가져오기
  const [nickname, setNickname] = useState('');

  // 파이어베이스 이미지 저장 경로 설정
  const category = "freeboard";
  const postId = maxId+ 1; // maxId를 postId로 사용

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: '로그인 후 이용해 주세요',
        icon: 'warning',
        confirmButtonText: '확인',
        confirmButtonColor: '#48088A'
      }).then(() => {
        navigate(-1);
      });
    }
}, [token, navigate]);

  useEffect(() => {
    if (!userProfile) {
      dispatch(fetchUserProfile({ serverUrl, memberEmail, token }));
    }
  }, [dispatch, decodedToken, serverUrl, token, memberEmail]); // userProfile이 변경되거나 로드되지 않았을 때 프로필을 다시 가져오기 위해 useEffect 사용

  if (!decodedToken || !userProfile) {
    return (
      <div className="permissionMessage">
          <div>로딩중...
            <div>
              <Spinner animation="border" variant="dark" />
            </div>
          </div>
        </div>
    );
  }

  // 이미지 URL 추출 함수
  const extractImageUrls = (content) => {
    const regex = /!\[.*?\]\((.*?)\)/g;
    let urls = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  };

  // 사용되지 않는 이미지 삭제 함수
  const deleteUnusedImages = async (currentContent) => {
    const usedImageUrls = extractImageUrls(currentContent);
    const uploadedImages = editorRef.current.getUploadedImages();

    const unusedImages = uploadedImages.filter(url => !usedImageUrls.includes(url));

    for (const url of unusedImages) {
      const imageRef = ref(storage, url);
      try {
        await deleteObject(imageRef);
        console.log(`Deleted unused image: ${url}`);
      } catch (error) {
        console.error(`Failed to delete unused image: ${url}`, error);
      }
    }
  };

  const onSubmitHandler = async () => {
    const content = editorRef.current.getInstance().getMarkdown();

    if (title.trim() === '') {
      Swal.fire({
        title: '제목을 입력해주세요!',
        icon: 'warning',
        confirmButtonColor: '#48088A',
        confirmButtonText: '확인',
      });
      return;
    }

    if (content.trim() === '') {
      Swal.fire({
        title: '내용을 입력해주세요!',
        icon: 'warning',
        confirmButtonColor: '#48088A',
        confirmButtonText: '확인',
      });
      return;
    }

    await deleteUnusedImages(content);

    const newBoard = {
      author_id: decodedToken?.email,
      nickname: userProfile.profile.nickname,
      category: 1,
      title,
      content,
      writeday: new Date().toISOString().split('T')[0],
      views: 0,
      like: 0,
      repl_cnt: 0,
      photoes: ''
    };

    Swal.fire({
      title: "게시물을 제출하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: 'black',
      cancelButtonColor: 'grey',
      confirmButtonText: '제출',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(addBoard(newBoard));
        Swal.fire({
          title: "게시물이 등록되었습니다!",
          icon: 'success',
          confirmButtonColor: 'black'
        }).then(() => {
          navigate('/board/freeboard');
        });
      } else {
        Swal.fire({
          title: '게시물 수정이 취소되었습니다.',
          icon: 'info',
          confirmButtonColor: 'black'
        });
      }
    });
  };

  const onExitHandler = () => {
    navigate('/board/freeboard');
  };

  const onChangeTitleHandler = e => {
    setTitle(e.target.value);
  };

  return (
    <>
    <BoardDetailTop category={1} />
    <div className="inputContainer">
      <div className="topContainer">
        <div className="textareaHeader">
        <div className="textareaBox">
            <input
              className="textareaBox"
              placeholder="타이틀을 입력해주세요"
              value={title}
              onChange={onChangeTitleHandler}
            />
          </div>
        </div>
      </div>
      <div className="contentContainer">
        <div className="mypageContainer">
          <ToastEditor ref={editorRef} category={`${category}`} postId={postId} />        
        </div>
      </div>
      <div className="bottomContainer">
        <div className="buttonArea1">
          <button className="backButton" onClick={onExitHandler}>
              <div className="arrowText" onClick={onExitHandler}> ↩ 나가기</div>
          </button>
        </div>
        <div className="buttonArea2">
          <button className="submitButton" onClick={onSubmitHandler}>
            제출하기
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default WriteFreeBoard
