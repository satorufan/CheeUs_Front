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

function EditFreeBoard(){
    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const editorRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const userProfile = useSelector(state => state.profile.userProfile); // 예시에 따라 수정
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
                {isEditMode ? '수정하기' : '제출하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default EditFreeBoard;