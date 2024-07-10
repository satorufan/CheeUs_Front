import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../board/ToastEditor';
import './DTBinputForm.css'; 
import DTBoardMap from './DTBoardMap';


function DTBInputForm({ type = 'edit' }) {
  const [title, setTitle] = useState('');
  const editorRef = useRef();
  const navigate = useNavigate();

  const onSubmitHandler = async () => {
    if (title === '') return;
    const content = editorRef.current?.getInstance().getMarkdown();
    const postData = {
      title,
      content,
    };
  };

  const onExitHandler = () => {
    navigate('/dtboard');
  };

  const onChangeTitleHandler = e => {
    setTitle(e.target.value);
  };
  

  return (
	 <div className = "inputContainer">
	 	<div className = 'topContainer'>
	      <textarea
	        className="textarea"
	        placeholder="타이틀을 입력해주세요"
	        value={title}
	        onChange={onChangeTitleHandler}
	      />
	 	</div>
	 	<div className = "contentContainer">
		    <div className="mypageContainer">
		      <ToastEditor editorRef={editorRef} />
		    </div>
		    <div className ='mapContainer'>
		    	<DTBoardMap />
		    </div>
		    </div>
		    <div className = "bottomContainer">
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