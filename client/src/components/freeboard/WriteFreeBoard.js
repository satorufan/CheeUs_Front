import React, { useState, useRef, useContext, useEffect } from 'react'; // useEffect 추가
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
import { addBoard, selectMaxId } from '../../store/BoardSlice';
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';
import { AuthContext } from '../login/OAuth'; 
import swal from 'sweetalert';
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
        swal({
            title: '로그인 후 이용해 주세요',
            icon: 'warning',
            button: '확인',
            className: 'custom-swal-warning'
        }).then(() => {
            navigate(-1); // 이전 페이지로 이동
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
    if (title === '') return;

    const content = editorRef.current.getInstance().getMarkdown();

    await deleteUnusedImages(content);
    
    const findMaxId = () => {
      let maxId = 0;
      boards.forEach(board => {
        if (board.id > maxId) {
          maxId = board.id;
        }
      });
      return maxId;
    };

    const newId = findMaxId() + 1;

    // author_id와 author_name, nickname 설정
    const authorId = decodedToken?.email;
    const authorName = userProfile.name;
    const nickname = userProfile.profile.nickname;
    //console.log("붙었나? " + nickname);

    const newBoard = {
      author_id: authorId,
      nickname,
      category: 1,
      title,
      content,
      writeday: new Date().toISOString().split('T')[0],
      views: 0,
      like: 0,
      repl_cnt: 0,
      photoes: '',
      media: ''
    };

    swal({
      title: "게시물을 제출하시겠습니까?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        // 콘솔에 제출된 정보 출력
        // console.log('제출된 게시물 정보:', newBoard);

        // 사용자가 확인 버튼을 누르면 게시물 제출
        dispatch(addBoard(newBoard));

        // 성공 메시지 표시
        swal("게시물이 성공적으로 등록되었습니다!", {
          icon: "success",
        }).then(() => {
          navigate('/board/freeboard');
        });
      } else {
        // 사용자가 취소 버튼을 누르면 알림
        swal("게시물 제출이 취소되었습니다.");
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
