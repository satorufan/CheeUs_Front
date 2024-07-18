import React, { useState, useRef, useContext, useEffect } from 'react';
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
import './writeShortForm.css';

function WriteShortForm(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // 에디터의 내용을 상태로 관리
    const [videoUrl, setVideoUrl] = useState(''); // 동영상 URL 상태 추가
    const [file, setFile] = useState(null); // 선택된 파일을 상태로 관리
    const editorRef = useRef();
    const videoRef = useRef();
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
      if (title === '' || !content) return; // 제목이나 내용이 비어있으면 제출하지 않음
  
      let uploadedFileUrl = '';
      if (file) {
        // 파일 업로드 처리 (여기서는 예시로 파일 이름만 콘솔에 출력)
        console.log('업로드된 파일:', file);
        // 실제로 파일을 업로드하고, 업로드된 파일의 URL을 받아온다고 가정
        uploadedFileUrl = 'http://example.com/uploads/' + file.name;
      }
  
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
        category: 1,
        title,
        content,
        writeday: new Date().toISOString().split('T')[0],
        views: 0,
        like: 0,
        repl_cnt: 0,
        photoes: '', // 여기서는 이미지 업로드를 다루지 않으므로 빈 문자열 처리
        videoUrl,
        uploadedFileUrl, // 업로드된 파일의 URL 추가
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

    // 에디터의 내용 변경 시 호출되는 함수
    const onChangeContentHandler = () => {
      setContent(editorRef.current.getInstance().getMarkdown());
    };
  
    // 파일 선택 시 호출되는 함수
    const onFileChangeHandler = e => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
  
      // 파일 선택 후 미리보기를 위해 URL 생성
      const fileUrl = URL.createObjectURL(selectedFile);
      setVideoUrl(fileUrl);
  
      // 선택된 파일이 변경될 때마다 videoRef를 초기화
      videoRef.current.load();
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
            <ToastEditor ref={editorRef} onChangeContent={onChangeContentHandler} />
          </div>
          <div className="videoPreviewContainer">
            {videoUrl && (
              <video ref={videoRef} controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="fileUploadContainer">
            <label htmlFor="fileUpload">동영상 업로드:</label>
            <input
              type="file"
              id="fileUpload"
              name="fileUpload"
              onChange={onFileChangeHandler}
            />
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

export default WriteShortForm;
