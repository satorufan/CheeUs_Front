import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from './ToastEditor';
import './DTBinputForm.css';
import InputMap from './InputMap';
import { usePosts } from './PostContext';

function DTBInputForm() {
  const [title, setTitle] = useState('');
  const editorRef = useRef();
  const navigate = useNavigate();
  const { addPost } = usePosts();

  const onSubmitHandler = async () => {
    if (title === '') return;
    const content = editorRef.current?.getInstance().getMarkdown();
    addPost(title, content);
    navigate('/dtboard'); // 게시글 작성 후 게시판으로 이동
  };

  const onExitHandler = () => {
    navigate('/dtboard');
  };

  const onChangeTitleHandler = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="inputContainer">
      <div className="topContainer">
        <div className="textareaHeader">
          <textarea
            className="textarea"
            placeholder="타이틀을 입력해주세요"
            value={title}
            onChange={onChangeTitleHandler}
          />
        </div>
        <div className="mapHeader">
          <div className="mapping">
            장소 :
            <a> 지도정보</a>
          </div>
        </div>
      </div>
      <div className="contentContainer">
        <div className="mypageContainer">
          <ToastEditor editorRef={editorRef} />
        </div>
        <div className="mapContainer">
          <InputMap />
        </div>
      </div>
      <div className="bottomContainer">
        <div className="buttonsWrap">
          <button className="backButton" onClick={onExitHandler}>
            <div className="arrowWrap">
              <BsArrowLeft className="arrow" />
              <span className="arrowText">나가기</span>
            </div>
          </button>
          <button className="submitButton" onClick={onSubmitHandler}>
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default DTBInputForm;
