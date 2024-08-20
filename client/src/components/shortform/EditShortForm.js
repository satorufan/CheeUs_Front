import React, { useState, useRef, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
import { fetchBoardsMedia, selectPageBoardsMedia, updateBoard } from '../../store/BoardSlice';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';
import { Form } from 'react-bootstrap';
import { fetchUserProfile, selectUserProfile } from '../../store/ProfileSlice';
import BoardDetailTop from '../board/BoardDetailTop';
import Spinner from 'react-bootstrap/Spinner';
import { storage } from "../firebase/firebase";
import { marked } from 'marked'; 
import { ref, deleteObject, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './writeShortForm.css'

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
  const medias = useSelector(selectPageBoardsMedia);
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
  const [boardToEdit, setBoardToEdit] = useState(null);

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  useEffect(() => {
    if (id && boards.length > 0) {
      const board = boards.find(b => b.id === parseInt(id, 10));
      if (!board || memberEmail !== board.author_id) {
        Swal.fire({
          title: '잘못된 접근입니다.',
          icon: 'warning',
          confirmButtonText: '확인',
          confirmButtonColor: '#48088A'
        }).then(() => {
            navigate(-1);
        });
      }

      if (board) {
        setBoardToEdit(board);
        setTitle(board.title);
        setContent(board.content);
        setVideoUrl(medias[board.id] || '');
        console.log(board);
        console.log('기존 파일 정보:', medias[board.id]);
        console.log('기존 콘텐츠:', board.content);
        console.log('기존 콘텐츠:', board.title);
      }
    }
  }, [id, boards]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(content || '');
    }
  }, [content]);

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
    if (boardToEdit) {
      dispatch(fetchBoardsMedia({category: 'shortform', perPageBoards: [boardToEdit]}));
    }
  }, [dispatch, boardToEdit]);

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
    const content = editorRef.current.getInstance().getMarkdown();

    if (title.trim() === '') {
      Swal.fire({
        title: '제목을 입력해주세요!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#48088A',
        confirmButtonText: '확인'
      });
      return;
    } else if (content.trim() === '') {
      Swal.fire({
        title: '내용을 입력해주세요!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#48088A',
        confirmButtonText: '확인'
      });
      return;
    }

    deleteUnusedImages(content);

    let updatedFileUrl = videoUrl;
    if (file) {
      // 기존 파일 삭제
      if (videoUrl && videoUrl !== updatedFileUrl) {
        const oldFileRef = ref(storage, videoUrl.split('/o/')[1].split('?')[0]);
        try {
          await deleteObject(oldFileRef);
          console.log('Deleted old file:', videoUrl);
        } catch (error) {
          console.error('Failed to delete old file:', videoUrl, error);
        }
      }

      // 새 파일 업로드
      const newFileRef = ref(storage, `videos/${file.name}`);
      const uploadTask = uploadBytesResumable(newFileRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          
        }, 
        (error) => {
          console.error('File upload failed:', error);
        }, 
        async () => {
        
          const newFileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setVideoUrl(newFileUrl);
          console.log('Uploaded new file:', newFileUrl);
        }
      );
    }

    const updatedBoard = {
      ...boardToEdit,
      title,
      content,
      videoUrl: updatedFileUrl,
    };

    dispatch(updateBoard(updatedBoard));

    console.log('업데이트될 게시물 정보:', updatedBoard);

    const newHtmlContent = marked(content);
    const newImageUrls = extractImageUrls(newHtmlContent);

    const oldHtmlContent = marked(boardToEdit.content);
    const oldImageUrls = extractImageUrls(oldHtmlContent);

    const imagesToDelete = oldImageUrls.filter(url => !newImageUrls.includes(url));

    imagesToDelete.forEach(async (url) => {
      const path = url.split('/o/')[1].split('?')[0];
      const imageRef = ref(storage, decodeURIComponent(path));
      try {
        await deleteObject(imageRef);
        console.log(`Image deleted: ${url}`);
      } catch (error) {
        console.error(`Failed to delete image: ${url}`, error);
      }
    });

    Swal.fire({
      title: '게시물을 수정하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'black',
      cancelButtonColor: 'grey',
      confirmButtonText: '제출',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateBoard(updatedBoard));

        Swal.fire({
          title: '게시물이 수정되었습니다!',
          icon: 'success',
          confirmButtonColor: 'black'
        }).then(() => {
          navigate('/board/shortform');
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
    navigate('/board/shortform');
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
    if (selectedFile) {
      setFile(selectedFile);

      const fileUrl = URL.createObjectURL(selectedFile);
      setVideoUrl(fileUrl);

      if (videoRef.current) {
        videoRef.current.load();
      }
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
            <p>동영상 파일은 수정 불가능합니다!</p>
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
}

export default EditShortForm;
