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
import Spinner from 'react-bootstrap/Spinner';
import { storage } from "../firebase/firebase";
import { marked } from 'marked'; 
import { ref, deleteObject } from 'firebase/storage';

// 이미지 URL 추출 함수
const extractImageUrls = (htmlContent) => {
  const urls = [];
  const imgTags = htmlContent.match(/<img[^>]+src="([^">]+)"/g);
  if (imgTags) {
    imgTags.forEach((imgTag) => {
      const match = imgTag.match(/src="([^">]+)"/);
      if (match) {
        urls.push(match[1]);
      }
    });
  }
  return urls;
};
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
  const { token, memberEmail } = useContext(AuthContext);
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
      if(boards.length === 0 || (board && memberEmail !== board?.author_id)) {
        swal({
          title: '잘못된 접근입니다.',
          icon: 'warning',
          button: '확인',
          className: 'custom-swal-warning'
        }).then(() => {
            navigate(-1); // 이전 페이지로 이동
        });
      }

      if (board) {
        setBoardToEdit(board); // 기존 게시물 정보 설정
        setTitle(board.title);
        setContent(board.content)
        setVideoUrl(board.media);

        console.log('기존 파일 정보:', board.media); // 기존 파일 URL 출력
        console.log('기존 콘텐츠:', board.content); // 기존 콘텐츠 출력
        console.log('기존 콘텐츠:', board.title); // 기존 콘텐츠 출력
      }
    }
  }, [id, boards]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(content || '');
    }
  }, [content]);

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

  useEffect(() => {
    if (!userProfile) {
      dispatch(fetchUserProfile({ serverUrl: 'http://localhost:8080', decodedToken }));
    }
  }, [dispatch, decodedToken, userProfile]);

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

  const onSubmitHandler = async () => {
    if (title === '') return;

    const content = editorRef.current.getInstance().getMarkdown();
    deleteUnusedImages(content);

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
    dispatch(updateBoard(updatedBoard));

    console.log('업데이트될 게시물 정보:', updatedBoard);

    const newHtmlContent = marked(content); // Markdown을 HTML로 변환
    const newImageUrls = extractImageUrls(newHtmlContent);

    // 기존 HTML 컨텐츠에서 이미지 URL 추출
    const oldHtmlContent = marked(boardToEdit.content);
    const oldImageUrls = extractImageUrls(oldHtmlContent);

    // 삭제할 이미지 URL 추출
    const imagesToDelete = oldImageUrls.filter(url => !newImageUrls.includes(url));

    // Firebase Storage에서 이미지 삭제
    imagesToDelete.forEach(async (url) => {
      const path = url.split('/o/')[1].split('?')[0]; // Firebase Storage 경로 추출
      const imageRef = ref(storage, decodeURIComponent(path));
      try {
        await deleteObject(imageRef);
        console.log(`Image deleted: ${url}`);
      } catch (error) {
        console.error(`Failed to delete image: ${url}`, error);
      }
    });

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
    if (editorRef.current) {
      const newContent = editorRef.current.getInstance().getMarkdown();
      setContent(newContent); 
    }
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
        <ToastEditor 
          ref={editorRef} 
          initialValue={content || ''}
          onChange={() => onChangeContentHandler()}
        />
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