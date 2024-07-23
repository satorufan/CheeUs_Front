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
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

function DTBInputForm() {
  const [startDate, setStartDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(format(new Date(), 'yyyy.MM.dd HH:mm'));
  const editorRef = useRef();
  const navigate = useNavigate();
  const { addPost, selectedPlace } = usePosts();

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
    const formattedValue = format(startDate, '약속시간 : yyyy.MM.dd') + ' ' + format(startDate, 'HH:mm');
    return (
      <button className="example-custom-input" onClick={onClick} ref={ref} style={{ whiteSpace: 'pre-wrap' }}>
        {formattedValue}
      </button>
    );
  });

  const onSubmitHandler = async () => {
    if (title === '') {
	  Swal.fire({
	      title: '제목을 입력해주세요!',
	      icon: 'warning',
	      showCancelButton: false,
	      confirmButtonColor: '#48088A',
	      confirmButtonText: '확인',
      });
	  return;
	}
	if(!selectedPlace){
	  Swal.fire({
	      title: '지도에서 장소를 선택해주세요!',
	      icon: 'warning',
	      showCancelButton: false,
	      confirmButtonColor: '#48088A',
	      confirmButtonText: '확인',
      });		
      return;
	}
    
    
    const content = editorRef.current.getInstance().getMarkdown(); // content를 getInstance().getMarkdown()으로 받아옴
    addPost(title, content, time);
    navigate('/dtboard'); // 게시글 작성 후 게시판으로 이동
    window.location.reload();
  };

  const onExitHandler = () => {
    navigate('/dtboard');
    window.location.reload();
  };

  const onChangeTitleHandler = (e) => {
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
         <div className="dateHeader">
          <DatePicker
            locale={ko}
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              setTime(format(date, 'yyyy.MM.dd HH:mm'));
            }}
            dateFormat="yyyy.MM.dd HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="시간"
            customInput={<ExampleCustomInput />}
          />
        </div>
        </div>

        <div className="mapHeader">
          <div className="mapping">
            장소 :
            <a>
              {selectedPlace ? (
                <>
                	<a> </a>
                   {selectedPlace.title} ({selectedPlace.address})
                  	<span className="hidden">
                    	{selectedPlace.latitude} {selectedPlace.longitude}
                  	</span>
                </>
              ) : (
                ' 지도정보'
              )}
            </a>
          </div>
          <div></div>
        </div>
      </div>
      <div className="contentContainer">
        <div className="mypageContainer">
          <ToastEditor ref={editorRef} />
        </div>
        <div className="mapContainer">
          <InputMap isEditing={false} />
        </div>
      </div>
      <div className="bottomContainer">
        <div className="buttonsWrap">
         <div className = 'buttonArea1'>
          <button className="backButton" onClick={onExitHandler}>
            <div className="arrowWrap">
              <BsArrowLeft className="arrow" />
              <span className="arrowText">나가기</span>
            </div>
          </button>
         </div>
         <div className='buttonArea2'>
          <button className="submitButton" onClick={onSubmitHandler}>
            제출하기
          </button>
         </div>
        </div>
      </div>
    </div>
  );
};

export default DTBInputForm;
