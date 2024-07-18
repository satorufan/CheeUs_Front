import React, { useState, useRef, useContext, useEffect } from 'react'; // useEffect 추가
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
import { addBoard } from '../../store/BoardSlice';
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';
import { AuthContext } from '../login/OAuth'; 
import swal from 'sweetalert';
import { jwtDecode } from "jwt-decode";

const WriteEventBoard = () => {
  const [title, setTitle] = useState('');
  const editorRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext); // 현재 사용자 정보 가져오기
  const userProfile = useSelector(selectUserProfile); // Redux의 selectUserProfile selector를 사용하여 userProfile 가져옴
  const boards = useSelector(state => state.board.boards); // boards 변수를 Redux 상태에서 가져옴

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  useEffect(() => {
    if (!userProfile) {
      dispatch(fetchUserProfile({ serverUrl: 'http://localhost:8080', decodedToken }));
    }
  }, [dispatch, decodedToken, userProfile]); // userProfile이 변경되거나 로드되지 않았을 때 프로필을 다시 가져오기 위해 useEffect 사용

  if (!decodedToken || !userProfile) {
    return <div>Loading...</div>;
  }

  const onSubmitHandler = async () => {
    if (title === '') return;

    const content = editorRef.current.getInstance().getMarkdown();

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

    // author_id와 author_name 설정
    const authorId = decodedToken?.email;
    const authorName = userProfile.name;

    const newBoard = {
      id: newId,
      author_id: authorId,
      author_name: authorName,
      category: 3,
      title,
      content,
      writeday: new Date().toISOString().split('T')[0],
      views: 0,
      like: 0,
      repl_cnt: 0,
      photoes: '',
    };
    
    swal({
      title: "게시물을 제출하시겠습니까?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        // 콘솔에 제출된 정보 출력
        console.log('제출된 게시물 정보:', newBoard);

        // 사용자가 확인 버튼을 누르면 게시물 제출
        dispatch(addBoard(newBoard));

        // 성공 메시지 표시
        swal("게시물이 성공적으로 등록되었습니다!", {
          icon: "success",
        }).then(() => {
          navigate('/board/eventboard');
        });
      } else {
        // 사용자가 취소 버튼을 누르면 알림
        swal("게시물 제출이 취소되었습니다.");
      }
    });
  };

  const onExitHandler = () => {
    navigate('/board/eventboard');
  };

  const onChangeTitleHandler = e => {
    setTitle(e.target.value);
  };

  return (
    <div className="inputContainer">
      <div className="topContainer">
        <div className="textareaHeader">
          <textarea
            className="textareaBox"
            placeholder="타이틀을 입력해주세요"
            value={title}
            onChange={onChangeTitleHandler}
          />
        </div>
      </div>
      <div className="contentContainer">
        <div className="mypageContainer">
          <ToastEditor ref={editorRef} />
        </div>
      </div>
      <div className="bottomContainer">
        <div className="buttonsWrap">
          <div className="buttonArea1">
            <button className="backButton" onClick={onExitHandler}>
              <div className="arrowWrap">
                <BsArrowLeft className="arrow" />
                <span className="arrowText">나가기</span>
              </div>
            </button>
          </div>
          <div className="buttonArea2">
            <button className="submitButton" onClick={onSubmitHandler}>
              제출하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteEventBoard
