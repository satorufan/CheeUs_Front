import React, { useState, useRef, forwardRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Swal from 'sweetalert2';
import { fetchUserProfiles, selectProfiles,  } from '../../store/MatchSlice';
import { selectUserProfile } from '../../store/ProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../login/OAuth';


function DTBInputForm() {
  const [startDate, setStartDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(format(new Date(), 'yyyy.MM.dd HH:mm'));
  const editorRef = useRef();
  const navigate = useNavigate();
  const { addPost, selectedPlace } = usePosts();
  const dispatch = useDispatch();
  const { memberEmail, serverUrl, token } = useContext(AuthContext);
  const userProfile = useSelector(selectUserProfile);
  const profiles = useSelector(selectProfiles);  
  const [nickname, setNickname] = useState('');
  
  
  useEffect(() => {
    dispatch(fetchUserProfiles({ serverUrl, memberEmail }));
  }, [dispatch, serverUrl, memberEmail]);  
  
    useEffect(() => {
    if (profiles && memberEmail) {
      const user = profiles.find(profile => profile.profile.email === memberEmail);
    }
  }, [profiles, userProfile]);
  
   useEffect(() => {
       if (userProfile) {
           setNickname(userProfile.profile.nickname);
       }
   }, [userProfile]);  

  const ExampleCustomInput = forwardRef(({ value, onClick}, ref) => {
    const formattedValue = format(startDate, '약속시간 : yyyy.MM.dd') + ' ' + format(startDate, 'HH:mm');
    return (
      <button className='example-custom-input' onClick={onClick} ref={ref} style={{ whiteSpace: 'pre-wrap' }}>
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
    
    addPost(title, content, time, nickname, memberEmail);
    Swal.fire({
      title: '채팅방이 생성되었습니다!',
      icon: '',
      showCancelButton: false,
      confirmButtonColor: '#48088A',
      confirmButtonText: '확인',
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
                  placeholder="타이틀을 입력해주세요"
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
                    setTime(format(date, 'yyyy.MM.dd HH:mm'));
                  }}
                  dateFormat="yyyy.MM.dd HH:mm"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="시간"
                  customInput={<ExampleCustomInput />}
                  wrapperClassName='datepicker-wrapper'
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
                      {selectedPlace.title} ({selectedPlace.address})
                      <span className="hidden">
                        {selectedPlace.latitude} {selectedPlace.longitude}
                      </span>
                    </>
                  ) : (
                    ' 지도에서 장소를 선택하세요'
                  )}
                </a>
              </div>
            </div>
            <div className="mapContainer">
              <InputMap isEditing={false} />
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
};

export default DTBInputForm;
