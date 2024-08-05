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
import { jwtDecode } from 'jwt-decode';
import './writeShortForm.css';
import { Form } from 'react-bootstrap';

function WriteShortForm() {
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [file, setFile] = useState(null);
    const editorRef = useRef();
    const videoRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const userProfile = useSelector(selectUserProfile);
    const boards = useSelector((state) => state.board.boards);
    const [nickname, setNickname] = useState('');
  
    let decodedToken;
    if (token) {
      decodedToken = jwtDecode(token);
    }
  
    useEffect(() => {
      if (!userProfile) {
        dispatch(fetchUserProfile({ serverUrl: 'http://localhost:8080', decodedToken }));
      }
    }, [dispatch, decodedToken, userProfile]);
  
    if (!decodedToken || !userProfile) {
      return <div>Loading...</div>;
    }
  
    const onSubmitHandler = async () => {
      let uploadedFileUrl = '';
      if (file) {
        console.log('업로드된 파일:', file);
        uploadedFileUrl = 'http://example.com/uploads/' + file.name;
      }

      const content = editorRef.current.getInstance().getMarkdown();
  
      const findMaxId = () => {
        let maxId = 0;
        boards.forEach((board) => {
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
        category: 2,
        title,
        content,
        writeday: new Date().toISOString().split('T')[0],
        views: 0,
        like: 0,
        repl_cnt: 0,
        photoes: '',
        media: ''
      };
  
      console.log('제출될 게시물 정보:', newBoard); // 콘솔에 제출될 게시물 정보 출력
  
      swal({
        title: '게시물을 제출하시겠습니까?',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willSubmit) => {
        if (willSubmit) {
          dispatch(addBoard(newBoard));
  
          swal('게시물이 성공적으로 등록되었습니다!', {
            icon: 'success',
          }).then(() => {
            navigate('/board/shortform'); // Fix the route according to your application logic
          });
        } else {
          swal('게시물 제출이 취소되었습니다.');
        }
      });
    };
  
    const onExitHandler = () => {
      navigate('/board/shortform'); // Fix the route according to your application logic
    };
  
    const onChangeTitleHandler = (e) => {
      setTitle(e.target.value);
    };

    const onFileChangeHandler = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
  
      const fileUrl = URL.createObjectURL(selectedFile);
      setVideoUrl(fileUrl);
  
      // videoRef.current가 정의되어 있는지 확인한 후 load() 메서드 호출
      if (videoRef.current) {
        videoRef.current.load();
      }
    };

    return (
      <div className="shortform-inputContainer">
        <div className="shortform-topContainer">
          <div className="shortform-textareaHeader">
            <textarea
              className="short-textareaBox"
              placeholder="타이틀을 입력해주세요"
              value={title}
              onChange={onChangeTitleHandler}
            />
          </div>
        </div>
        <div className="shortform-write-container">
          <div className="shortform-write-editor">
            <ToastEditor ref={editorRef} />
          </div>
          <div className="shortform-write-upload">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>동영상 파일:</Form.Label>
              <Form.Control
                type="file"
                onChange={onFileChangeHandler}
                accept="video/mp4,video/webm,video/*"
              />
            </Form.Group>
            <div className="shortform-videoPreviewContainer">
              {videoUrl && (
                <video ref={videoRef} controls>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
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
}

export default WriteShortForm;