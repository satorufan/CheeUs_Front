import React, { useState, useRef, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from './ToastEditor';
import './DTBinputForm.css';
import InputMap from './InputMap';
import { usePosts } from './PostContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/locale";
import { format } from 'date-fns';

function DTBInputForm() {
  const [startDate, setStartDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const editorRef = useRef();
  const navigate = useNavigate();
  const { addPost, selectedPlace } = usePosts();

	const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
    const formattedValue = format(startDate, '약속시간 : yyyy년 MM월 dd일') + " " + format(startDate, 'HH:mm');
    return (
      <button className="example-custom-input" onClick={onClick} ref={ref} style={{ whiteSpace: 'pre-wrap' }}>
        {formattedValue}
      </button>
    );
  });


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
       <div className = "dateHeader">
       	<DatePicker
 		   locale={ko}
 		   selected={startDate}
 		   onChange={(date) => setStartDate(date)}
 		   dateFormat="yyyy년 MM월 dd일 HH:mm"
           showTimeSelect
           timeFormat="HH:mm"
           timeIntervals={15}
           timeCaption="시간"
 		   customInput={<ExampleCustomInput />}
		/>
       </div>
        <div className="mapHeader">
          <div className="mapping">
            장소 :
            <a>{selectedPlace ? `${selectedPlace.title} (${selectedPlace.address})` : ' 지도정보'}</a>
          </div>
           <div>
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
