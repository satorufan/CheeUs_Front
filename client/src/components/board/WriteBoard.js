import React, { useRef, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
import { addBoard } from '../../store/BoardSlice';
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';
import { AuthContext } from '../login/OAuth'; 
import swal from 'sweetalert';
import { jwtDecode } from "jwt-decode";
import BoardDetailTop from '../board/BoardDetailTop';
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase/firebase";
import Spinner from 'react-bootstrap/Spinner';

// WriteBoard 컴포넌트
const WriteBoard = ({ category, categoryId, navigateTo }) => {
  const [title, setTitle] = useState('');
  const editorRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serverUrl, memberEmail, token, isAuthenticated } = useContext(AuthContext); 
  const userProfile = useSelector(selectUserProfile); 
  const boards = useSelector(state => state.board.boards); 

  // 로그인 상태 확인
  useEffect(() => {
    if (!token) {
      swal({
        title: '로그인 후 이용해 주세요',
        icon: 'warning',
        button: '확인',
        className: 'custom-swal-warning'
      }).then(() => {
        navigate(-1); 
      });
    }
  }, [token, navigate]);

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  useEffect(() => {
    if (token && !userProfile) {
      dispatch(fetchUserProfile({ serverUrl, memberEmail, token }));
    }
  }, [dispatch, decodedToken, serverUrl, token, memberEmail, userProfile, token]); 

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
    if (title.trim() === '') {
      return swal({
        title: '제목을 입력해주세요',
        icon: 'warning',
        className: 'custom-swal-warning'
      });
    }

    const content = editorRef.current.getInstance().getMarkdown();

    if (content.trim() === '') {
      return swal({
        title: '내용을 입력해주세요',
        icon: 'warning',
        className: 'custom-swal-warning'
      });
    }

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

    const newBoard = {
      author_id: authorId,
      nickname,
      category: categoryId,
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
      className: 'custom-swal-confirm'
    }).then((willSubmit) => {
      if (willSubmit) {
        dispatch(addBoard(newBoard));

        swal({
          title: "게시물이 성공적으로 등록되었습니다!",
          icon: "success",
          className: 'custom-swal-success'
        }).then(() => {
          navigate(navigateTo);
        });
      } else {
        swal({
          title: "게시물 제출이 취소되었습니다.",
          icon: "error",
          className: 'custom-swal-cancel'
        });
      }
    });
  };

  const onExitHandler = () => {
    navigate(navigateTo);
  };

  const onChangeTitleHandler = e => {
    setTitle(e.target.value);
  };

  return (
    <>
      <BoardDetailTop category={categoryId} />
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
            <ToastEditor ref={editorRef} />
          </div>
        </div>
        <div className="bottomContainer">
          <div className="buttonArea1">
            <button className="backButton" onClick={onExitHandler}>
              <div className="arrowText"> ↩ 나가기</div>
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

export default WriteBoard;
