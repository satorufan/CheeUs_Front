import React, { useState, useRef, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
import { updateBoard } from '../../store/BoardSlice';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../login/OAuth';
import BoardDetailTop from '../board/BoardDetailTop';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from "../firebase/firebase";
import { marked } from 'marked'; 

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
  
  const EditBoard = ({ category }) => {
    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const editorRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, memberEmail } = useContext(AuthContext);
    const boards = useSelector(state => state.board.boards);
    const [boardToEdit, setBoardToEdit] = useState(null);
    console.log(boards);

    //파이어베이스 이미지 경로 설정
    var categoryName = "";
    if (category == 1) {
      categoryName = "freeboard";
    } else {
      categoryName = "eventboard";
    }

    let decodedToken;
    if (token) {
      decodedToken = jwtDecode(token);
    }
  
    useEffect(() => {
      if (id) {
        const board = boards.find(b => b.id === parseInt(id, 10));
        if(boards.length === 0 || (board && memberEmail !== board?.author_id)) {
          Swal.fire({
            title: '잘못된 접근입니다.',
            icon: 'warning',
            confirmButtonText: '확인',
            confirmButtonColor: 'black'
          }).then(() => {
            navigate(-1);
          });
        } else {
          setBoardToEdit(board);
          setIsEditMode(true);
          setTitle(board.title);
          if (editorRef.current && editorRef.current.getInstance()) {
            editorRef.current.getInstance().setMarkdown(board.content);
          }
        }
      }
    }, [id, boards]);
  
    const board = boards.find(b => b.id === parseInt(id, 10));

    // 사용되지 않는 이미지 삭제 함수
    const deleteUnusedImages = async (currentContent) => {
      const usedImageUrls = extractImageUrls(currentContent);
      const originalImageUrls = extractImageUrls(marked(board.content));

      console.log("usedImage : " , usedImageUrls);
      console.log("originalImage : " , originalImageUrls);

      
      const uploadedImages = editorRef.current.getUploadedImages();
  
      // 기존 컨텐츠에 있었으나 현재 컨텐츠에 없는 이미지를 삭제 대상으로 설정
      const imagesToDelete = originalImageUrls.filter(url => !usedImageUrls.includes(url));
  
      for (const url of imagesToDelete) {
        if (!uploadedImages.includes(url)) { // 새로 추가된 이미지는 제외
          const imageRef = ref(storage, url);
          try {
            await deleteObject(imageRef);
            console.log(`Deleted unused image: ${url}`);
          } catch (error) {
            console.error(`Failed to delete unused image: ${url}`, error);
          }
        }
      }
    };
  
    const onSubmitHandler = async () => {
      const content = editorRef.current.getInstance().getMarkdown();
      if (title.trim() === '') {
        Swal.fire({
          title: '제목을 입력해주세요!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#48088A',
          confirmButtonText: '확인',
      });
      return;
      } else if (content.trim() === '') {
        Swal.fire({
          title: '내용을 입력해주세요!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#48088A',
          confirmButtonText: '확인',
      });
      return;
      }
        
        // 현재 컨텐츠의 HTML
        const newHtmlContent = marked(content);

        // 불필요한 이미지 삭제
        await deleteUnusedImages(newHtmlContent);
      
      
      const updatedBoard = {
        ...boardToEdit,
        title,
        content,
      };
  
      dispatch(updateBoard(updatedBoard));
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
            navigate(`/board/${category === 1 ? 'freeboard' : 'eventboard'}`);
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
      navigate(`/board/${category === 1 ? 'freeboard' : 'eventboard'}`);
    };
  
    const onChangeTitleHandler = (e) => {
      setTitle(e.target.value);
    };
  
    return (
      <div className="inputContainer">
        <BoardDetailTop category={category} />
        <div className="topContainer">
          <div className="textareaBox">
            <input
              className="textareaBox"
              placeholder="타이틀을 입력해주세요"
              value={title}
              onChange={onChangeTitleHandler}
            />
          </div>
        </div>
        <div className="contentContainer">
          <div className="mypageContainer">
            <ToastEditor ref={editorRef} category={`${categoryName}`} postId={id} />        
          </div>
        </div>
        <div className="bottomContainer">
          <div className="buttonArea1">
            <button className="backButton" onClick={onExitHandler}>
              <span className="arrowText">나가기</span>
            </button>
          </div>
          <div className="buttonArea2">
            <button className="submitButton" onClick={onSubmitHandler}>
              {isEditMode ? '수정하기' : '제출하기'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default EditBoard;