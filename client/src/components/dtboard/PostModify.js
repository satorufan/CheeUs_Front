import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import '@toast-ui/editor/dist/toastui-editor.css';
import ToastEditor from '../toast/ToastEditor';
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
    <div className="dt-input">
        <div className="board-page-top">함께 마셔요</div>
    <div className="input-Container">
      <div className="dt-input-left-box">
        <div className="textareaHeader">
        <div className="textareaBox">
          <input
            className="textareaBox"
            placeholder=""
            value={title}
            onChange={onChangeTitleHandler}
          />
          </div>
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
        <div className="dt-input-mypage-box">
            <ToastEditor ref={editorRef} />
        </div>
        </div>
        <div className="dt-input-right-box">
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
                '지도에서 장소를 선택하세요'
              )}
            </a>
          </div>
          </div>
        <div className="mapContainer">
          <InputMap isEditing={true} />
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
  );
}

export default PostModify;
