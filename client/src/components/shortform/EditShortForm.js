import React, { useState, useRef, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
import { updateBoard } from '../../store/BoardSlice';
import swal from 'sweetalert';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';
import { Form } from 'react-bootstrap';
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';
import BoardDetailTop from '../board/BoardDetailTop';

function EditShortForm() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState(null);
  const editorRef = useRef();
  const videoRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);
  const userProfile = useSelector(state => state.profile.userProfile);
  const boards = useSelector(state => state.board.boards);
  const [boardToEdit, setBoardToEdit] = useState(null); // boardToEdit 상태 추가

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  useEffect(() => {
    if (id && boards.length > 0) {
      const board = boards.find(b => b.id === parseInt(id, 10));
      if (board) {
        setBoardToEdit(board); // 기존 게시물 정보 설정
        setTitle(board.title);
        setContent(board.content);
        setVideoUrl(board.videoUrl);
      }
    }
  }, [id, boards]);

  useEffect(() => {
    if (!userProfile) {
      dispatch(fetchUserProfile({ serverUrl: 'http://localhost:8080', decodedToken }));
    }
  }, [dispatch, decodedToken, userProfile]);

  if (!decodedToken || !userProfile) {
    return <div>Loading...</div>;
  }

  const onSubmitHandler = async () => {
    if (title === '') return;

    let updatedFileUrl = '';
    if (file) {
      console.log('업로드된 파일:', file);
      updatedFileUrl = 'http://example.com/uploads/' + file.name;
    }

    const updatedBoard = {
      ...boardToEdit, // 기존의 boardToEdit 상태를 복사
      title,
      content,
      videoUrl: updatedFileUrl || videoUrl, // 파일이 업데이트되지 않으면 기존의 videoUrl 사용
    };

    console.log('업데이트될 게시물 정보:', updatedBoard);

    swal({
      title: '게시물을 수정하시겠습니까?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        dispatch(updateBoard(updatedBoard)); // updateBoard 액션 디스패치

        swal('게시물이 성공적으로 수정되었습니다!', {
          icon: 'success',
        }).then(() => {
          navigate('/board/shortform'); // 수정 후 이동할 경로 설정
        });
      } else {
        swal('게시물 수정이 취소되었습니다.');
      }
    });
  };

  const onExitHandler = () => {
    navigate('/board/shortform'); // 나가기 버튼 클릭 시 이동할 경로 설정
  };

  const onChangeTitleHandler = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContentHandler = () => {
    const newContent = editorRef.current.getInstance().getMarkdown();
    setContent(newContent); // content 상태 업데이트
  };

  const onFileChangeHandler = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const fileUrl = URL.createObjectURL(selectedFile);
    setVideoUrl(fileUrl);

    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <>
    <BoardDetailTop category={2} />
    <div className="shortform-inputContainer">
      <div className="shortform-topContainer">
        <div className="shortform-textareaHeader">
        <div className="textareaBox">
          <input
            className="short-textareaBox"
            placeholder="타이틀을 입력해주세요"
            value={title}
            onChange={onChangeTitleHandler}
          />
          </div>
        </div>
      </div>
      <div className="shortform-write-container">
        <div className="shortform-write-editor">
          <ToastEditor ref={editorRef} initialValue={content} onChangeContent={onChangeContentHandler} />
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
}

export default EditShortForm;