import React, { useState, useRef, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
import { updateBoard } from '../../store/BoardSlice';
import swal from 'sweetalert';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../login/OAuth';
import BoardDetailTop from '../board/BoardDetailTop';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from "../firebase/firebase";
import { marked } from 'marked'; // Markdown을 HTML로 변환하기 위한 라이브러리


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

function EditFreeBoard(){
    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const editorRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    //const userProfile = useSelector(state => state.profile.userProfile); // 예시에 따라 수정
    const boards = useSelector(state => state.board.boards);
    const [boardToEdit, setBoardToEdit] = useState(null);

    let decodedToken;
    if (token) {
      decodedToken = jwtDecode(token);
    }

    useEffect(() => {
      if (id) {
        const board = boards.find(b => b.id === parseInt(id, 10));
        if (board) {
          setBoardToEdit(board);
          setIsEditMode(true);
          setTitle(board.title);
          if (editorRef.current && editorRef.current.getInstance()) {
            editorRef.current.getInstance().setMarkdown(board.content);
          }
        }
      }
    }, [id, boards]);

    const onSubmitHandler = async () => {
      if (title === '') return;

      const content = editorRef.current.getInstance().getMarkdown();
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


      const updatedBoard = {
        ...boardToEdit,
        title,
        content,
      };

      dispatch(updateBoard(updatedBoard));

      swal({
        title: "게시물이 수정되었습니다!",
        icon: "success",
      }).then(() => {
        navigate('/board/freeboard');
      });
    };


    const onExitHandler = () => {
      navigate('/board/freeboard');
    };

    const onChangeTitleHandler = e => {
      setTitle(e.target.value);
    };

    return (
      <div className="inputContainer">
        <BoardDetailTop category={1} />
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
            <ToastEditor ref={editorRef} content={boardToEdit ? boardToEdit.content : ''} />
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
  }

export default EditFreeBoard;