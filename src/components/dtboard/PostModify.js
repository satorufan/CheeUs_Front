import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import swal from 'sweetalert';

function PostModify() {
  const { modifyPost, selectedPlace, posts, setSelectedPlace } = usePosts();
  const { id } = useParams();
  const post = posts.find((post) => post.id === parseInt(id));
  const navigate = useNavigate();
  const editorRef = useRef();
  const [startDate, setStartDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(format(new Date(), ' yyyy.MM.dd HH:mm'));

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setTime(post.time);
      setStartDate(new Date(post.time));
      setSelectedPlace({
        title: post.location,
        address: post.address,
        latitude: post.latitude,
        longitude: post.longitude
      });
      if (editorRef.current && editorRef.current.getInstance()) {
        editorRef.current.getInstance().setMarkdown(post.content);
      }
    }
  }, [post, setSelectedPlace]);

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
    const formattedValue = format(startDate, '약속시간 : yyyy.MM.dd') + ' ' + format(startDate, 'HH:mm');
    return (
      <button className="example-custom-input" onClick={onClick} ref={ref} style={{ whiteSpace: 'pre-wrap' }}>
        {formattedValue}
      </button>
    );
  });

  const onSubmitHandler = async () => {
    if (title === '') return;
    const content = editorRef.current.getInstance().getMarkdown(); // content를 getInstance().getMarkdown()으로 받아옴
    modifyPost(id, title, content, time);
    swal({
      title: "게시물이 수정되었습니다!",
      icon: "success",
    }).then(() => {
      navigate(`/dtboard/post/${id}`);
      window.location.reload();
    });
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
            placeholder=""
            value={title}
            onChange={onChangeTitleHandler}
          />
          <div className="dateHeader">
            <DatePicker
              locale={ko}
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setTime(format(date, ' yyyy.MM.dd HH:mm'));
              }}
              dateFormat=" yyyy.MM.dd HH:mm"
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
          <InputMap isEditing={true} />
        </div>
      </div>
      <div className="bottomContainer">
        <div className="buttonsWrap">
          <div className='buttonArea1'>
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
}

export default PostModify;
