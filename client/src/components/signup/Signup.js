// SignupForm.js
import { useContext, useEffect, useState } from 'react';
import './Signup.css';
import { AuthContext } from '../login/OAuth';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Swal from 'sweetalert2';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { updateUserLocation } from '../../store/ProfileSlice';
import { useDispatch, useSelector } from 'react-redux';

const Signup = () => {
  const availableTags = [
    '소주', '맥주', '양주', '막걸리', '칵테일', '하이볼', '차분하게', '신나게', '시끄럽게', '가성비 술집', '예쁜 술집'
  ];

  const sweetalert = (title, contents, icon, confirmButtonText) => {
    Swal.fire({
      title: title,
      text: contents,
      icon: icon,
      confirmButtonText: confirmButtonText
    });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLocation = useSelector((state) => state.profile.userLocation);

  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [tel, setTel] = useState('');
  const [authTelState, setAuthTelState] = useState(1);
  const [telAuthCode, setTelAuthCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [gender, setGender] = useState();
  const [locationDetail, setLocation] = useState({});
  const [isLocationChecked, setIsLocationChecked] = useState(false);
  const [isMatchingChecked, setIsMatchingChecked] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);	
  const [intro, setIntro] = useState('');
  // 태그
  const [tags, setTags] = useState([]);
  const [openTagModal, setOpenTagModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // 이미지
  const [photos, setPhotos] = useState([]); //썸네일
  const [imageFiles, setImageFiles] = useState([]); //실제로 저장될 이미지파일
  //발행한 토큰의 이메일 정보 불러오기
  const {token, serverUrl} = useContext(AuthContext);
  const [openAgreementModal, setOpenAgreementModal] = useState(false);

  const buttonStyleMale = {
    backgroundColor: gender === 0 ? 'black' : 'white',
    color : gender === 0 ? 'white' : 'black'
  };
  const buttonStyleFemale = {
    backgroundColor: gender === 1 ? 'black' : 'white',
    color : gender === 1 ? 'white' : 'black'
  };

  // photos에 입력받은 사진 임시 저장
  const handleUploadPhoto = (index) => (event) => {
    const file = event.target.files[0];

    if (file) {
      const maxSize = 3 * 1024 * 1024; // 3MB를 바이트 단위로 계산
      if (file.size <= maxSize) {
        const updatedFiles = [...imageFiles];
        updatedFiles[index] = file;
        setImageFiles(updatedFiles);
  
        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedPhotos = [...photos];
          updatedPhotos[index] = reader.result;
          setPhotos(updatedPhotos);
        };
        reader.readAsDataURL(file);
      } else {
        sweetalert("3MB 미만의 이미지를 업로드 해주세요", "", "error", "확인");
      }
    }
  };

  // 사진 제거
  const handleRemovePhoto = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setPhotos(updatedFiles);

    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
  };

  // input file을 대신 열어주는 버튼 핸들러
  const handleAddPhoto = (index) => {
      const fileInput = document.getElementById(`photo-input-${index}`);
      fileInput.click();
  };

  const nicknameCheck = (nickname) => {
    //axios 들어갈 자리
    axios.get(serverUrl + '/member/checkNickname', {params : {
      nickname : nickname
    }}).then((res) => {
      sweetalert("사용가능한 닉네임입니다." ,"","","확인");
      setNicknameChecked(true);
    }).catch((err)=>{
      sweetalert(err.response.data.message ,"","","확인");
    });
    //
  }

  // 전화번호 인증 코드 전송
  const sendTelAuthCode = () => {
    if (!(tel == null || tel.length != 11 || !/^\d*$/.test(tel))) {
      const formData = new FormData();

      formData.append("tel", tel);

      axios.post(serverUrl+"/member/send-mms", formData)
      .then((res)=>{
        if (res.data == "5회이상 실패하였습니다. 잠시후에 다시 시도해주세요.") {
          sweetalert("5회이상 실패하였습니다. 잠시후에 다시 시도해주세요.","","","확인");
        } else {
          sweetalert("인증 번호가 전송되었습니다","","","확인");
          setTime(180);
          setIsActive(true);
          setAuthTelState(0);
        }
      }).catch((err)=>{
        if (err.response.data == "fail") {
          sweetalert("인증 번호 전송실패! 전화번호 확인해주세요.","","","확인");
        } else {
          console.log(err.response.data);
        }
      });
    } else {
      sweetalert("올바른 전화번호를 입력해주세요!.","","","확인");
    }
  }

  // 인증 확인
  const verifyAuthCode = () => {
    const formData = new FormData();

    formData.append("tel", tel);
    formData.append("authCode", telAuthCode);

    axios.post(serverUrl+"/member/telVerify", formData)
    .then((res)=>{
      if (res.data == "success") {
        sweetalert("인증 성공하였습니다!","","","확인");
        setAuthTelState(1);
      } else {
        if (res.data == "5회이상 실패하였습니다. 잠시후에 다시 시도해주세요.") {
          sweetalert("5회이상 실패하였습니다. 잠시후에 다시 시도해주세요.","","","확인");
          setAuthTelState(null);
          setIsActive(false);
        } else {
          sweetalert(`잘못된 인증번호! 남은 횟수(${5-res.data})`,"","","확인");
        }
        console.log(res);
      }
    });
  }

  // 전화번호 인증시 동작할 타이머
  const [time, setTime] = useState(180); // 3분 = 180초
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (time === 0) return setIsActive(false);

    const interval = setInterval(() => {
      setTime(time => time - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };


  // 위치 정보 불러오기
  const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                dispatch(updateUserLocation(location));
                setLocation({
                  latitude : location.latitude,
                  longitude : location.longitude
                });
            },
            (error) => {
                console.error('위치 정보를 가져오는 데 실패했습니다:', error);
            }
        );
    } else {
        console.error('Geolocation이 지원되지 않습니다');
    }
  };

  // 태그 모달
  const handleOpenTagModal = () => {
    setOpenTagModal(true);
  };
  const handleCloseTagModal = () => {
    setOpenTagModal(false);
  };
  const handleTagToggle = (tag) => {
    setTags((prevTags) => {
        if (prevTags.includes(tag)) {
            return prevTags.filter((t) => t !== tag);
        } 
        else if (prevTags.length < 5) {
            return [...prevTags, tag];
        } 
        else {
            Swal.fire({
                icon: 'warning',
                text: '최대 5개의 태그만 선택할 수 있습니다.',
                confirmButtonText: '확인',
                customClass: {
                    popup: 'custom-swal-popup',
                }
            });
            return prevTags;
        }
    });
};
  
  const handleTagSubmit = () => {
    var tagsString = "";
    tags.map((tag, index)=>{
      tagsString += index < tags.length-1 ? tag + "/" : tag;
    });
    return tagsString;
  }

  // 서약서 모달
  const handleOpenAgreementModal = () => {
    setOpenAgreementModal(true);
  };
  const handleCloseAgreementModal = () => {
    setOpenAgreementModal(false);
  };

  const validateBirthdate = (birth) => {
    const year = parseInt(birth.substring(0, 4));
    const month = parseInt(birth.substring(4, 6));
    const day = parseInt(birth.substring(6, 8));

    if (month < 1 || month > 12) {
        sweetalert("생일을 정확히 입력해주세요! (월은 1~12 사이여야 합니다.)", '', '', '확인');
        return false;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        sweetalert(`생일을 정확히 입력해주세요! (일은 1~${daysInMonth} 사이여야 합니다.)`, '', '', '확인');
        return false;
    }

    return true;
};
const calculateAge = (birth) => {
  const year = parseInt(birth.substring(0, 4));
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  const month = parseInt(birth.substring(4, 6));
  const day = parseInt(birth.substring(6, 8));
  const currentMonth = new Date().getMonth() + 1; 
  const currentDay = new Date().getDate();

  if (month > currentMonth || (month === currentMonth && day > currentDay)) {
      return age - 1;
  }

  return age;
};

const validateName = (name) => {
  if (!name || name.trim().length === 0) {
      return false;
  }

  const nameRegex = /^[a-zA-Z가-힣]{1,20}$/; 
  return nameRegex.test(name);
};

  // 제출 - 회원가입 요청
  const handleComplete = async (event) => {
    event.preventDefault();
    console.log("submit");

    if (photos.length == 0) {
      sweetalert("프로필 사진 한 장 이상 추가하여야 합니다", '','','확인');
    } else if (!validateName(name)) {
      sweetalert("이름을 정확히 입력해주세요!", '', '', '확인');
    } else if (birth == null || birth.length != 8 || !/^\d*$/.test(birth) || !validateBirthdate(birth)) {
      sweetalert("생일을 정확히 입력해주세요!", '', '', '확인');
    } else if (calculateAge(birth) < 19) {
      sweetalert("만 19세 이상만 사용 가능합니다.", '', '', '확인');
          window.location.href = '/'; 
    } else if (tel == null || 
      tel.length != 11 || !/^\d*$/.test(tel)
    ) {
      sweetalert("전화번호를 정확히 입력해주세요!", '','','확인');
    } else if (authTelState != 1) {
      sweetalert("전화번호 인증을 완료해주세요!", '','','확인');
    } else if (nickname == null) {
      sweetalert("닉네임을 입력해주세요!", '','','확인');
    } else if (gender == null) {
      sweetalert("성별을 선택해주세요!", '','','확인');
    } else if (nicknameChecked == false) {
      sweetalert("닉네임 중복확인 해주세요!", '','','확인');
    } else if (isAgreementChecked == false) {
      sweetalert("약관에 동의를 해주세요!", '','','확인');
    } else {
      // 모두가 참일때 회원가입 진행
      if (isLocationChecked) {
        getUserLocation();
      }
      
      const memberProfileDetail = {
        email : jwtDecode(token).email,
        name : name,
        birth : birth,
        photo : photos.length,
        tel : tel,
        nickname : nickname,
        gender : gender,
        tags : tags ? handleTagSubmit() : null,
        locationOk : isLocationChecked,
        latitude : isLocationChecked ? locationDetail.latitude.toString() : null,
        longitude : isLocationChecked ? locationDetail.longitude.toString() : null,
        matchOk : isMatchingChecked,
        intro : intro
      };

      navigate('/signupcallback', {state : {memberProfileDetail, imageFiles}});
    }
  }

  return (
    <div className="signup-box">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleComplete}>
          <div className="form-sections">
            <div className="left-section-container">
            <div className="signup-top">회원가입 정보</div>
              <div className="left-section">
              <br></br>
                <div className="form-group">
                  <label>프로필 사진 ( 1개 이상 )</label>
                  <br/>
                  <div className="add-photo-grid-wrapper">
                    <div className="add-photo-grid">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="add-photo-container">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadPhoto(index)}
                            style={{ display: 'none' }}
                            id={`photo-input-${index}`}
                          />
                          <div className="add-photos">
                            {photos[index] ? (
                              <>
                                <img
                                  src={photos[index]}
                                  alt={`Photo ${index + 1}`}
                                  className="edit-photo-thumbnail"
                                />
                                <button
                                  type="button"
                                  className="add-remove-photo"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePhoto(index);
                                  }}
                                >
                                  <RemoveCircleOutlineIcon />
                                </button>
                              </>
                            ) : (
                              <>
                                {index === 0 || photos[index - 1] ? (
                                  <div
                                    className="add-photo-placeholder"
                                    onClick={() => handleAddPhoto(index)}
                                  >
                                    <AddCircleOutlineIcon />
                                  </div>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>
                </div>
              </div>
              <div className="form-group agreement-section">
                  <label>사용자정보 동의</label>
                  <br/>
                  <div className="agreement-group">
                    <div className="agreement">
                      <input
                        type="checkbox"
                        checked={isLocationChecked}
                        onChange={() => {
                          setIsLocationChecked(!isLocationChecked);
                          getUserLocation();
                        }}
                      />
                      &nbsp;&nbsp;위치정보 제공 동의
                    </div>
                    <div className="agreement">
                      <input
                        type="checkbox"
                        checked={isMatchingChecked}
                        onChange={() => setIsMatchingChecked(!isMatchingChecked)}
                        />
                        &nbsp;&nbsp;1:1 매칭 프로그램 사용 동의
                    </div>
                    <div className="agreement" onClick={handleOpenAgreementModal}>
                        <input
                        type="checkbox"
                        checked={isAgreementChecked}
                        required
                        />
                       &nbsp; 안전한 웹서비스 이용 서약서
                    </div>
                  </div>
                </div>
            </div>
  
            <div className="right-section-container">
              <div className="right-section">
                <div className="form-group">
                  <br/>
                  <label>이메일(ID)</label>
                  <input
                    type="text"
                    value={token ? jwtDecode(token).email : ""}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>이름</label>
                  <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>생년월일</label>
                  <input
                    type="text"
                    placeholder="생년월일을 입력하세요(ex. 20000101)"
                    value={birth}
                    onChange={(event) => setBirth(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>전화번호</label>
                  <div  className="tel-group">
                  <input
                    type="text"
                    placeholder="전화번호를 입력하세요(ex. 01011112222)"
                    value={tel}
                    onChange={(event) => setTel(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={sendTelAuthCode}
                    hidden={!(authTelState == null)}
                  >
                    전화번호 인증
                  </button>
                  <button
                    type="button"
                    hidden={!(authTelState == 1)}
                    className="check-button"
                  >
                    인증완료
                  </button>
                </div>
                <div className="form-group" hidden={!(authTelState == 0)}>
                  <label>전화번호 인증</label>
                  <input
                    type="text"
                    placeholder="인증번호를 입력하세요"
                    value={telAuthCode}
                    onChange={(event) => setTelAuthCode(event.target.value)}
                  />
                  <label>{formatTime(time)}</label>
                  <button
                    type="button"
                    onClick={verifyAuthCode}
                    hidden={!(authTelState == 0)}
                    className="check-button"
                  >
                    인증확인
                  </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>닉네임</label>
                  <div className="nickname-group">
                    <input
                      type="text"
                      placeholder="닉네임을 입력하세요 (변경불가)"
                      value={nickname}
                      onChange={(event) => setNickname(event.target.value)}
                    />
                    <button
                      type="button"
                      className="check-button"
                      onClick={() => nicknameCheck(nickname)}
                    >
                      중복확인
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>성별</label>
                  <div className="gender-buttons">
                    <button
                      type="button"
                      onClick={() => setGender(0)}
                      style={buttonStyleMale}
                      className="gender-buttons button"
                    >
                      남
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender(1)}
                      style={buttonStyleFemale}
                      className="gender-buttons button"
                    >
                      여
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    onClick={handleOpenTagModal}
                    variant="outlined"
                    className="edit-tags-btn"
                  >
                    음주 선호 태그
                  </button>
                  <div className="edit-tag-container">
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleTagToggle(tag)}
                        variant="outlined"
                        className="edit-tag-chip"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-section">
            <div className="form-group">
              <label>자기소개</label>
              <input
                placeholder="자기소개를 입력하세요"
                onChange={(event) => setIntro(event.target.value)}
                className='self-input'
              ></input>
            </div>
          </div>
          {/* 태그 모달 */}
          <Dialog open={openTagModal} onClose={handleCloseTagModal}>
            <DialogContent className="dialog-content">
              <h1>음주 선호 태그</h1>
              <div className="edit-tag-selection">
                {availableTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagToggle(tag)}
                    variant={tags.includes(tag) ? "filled" : "outlined"}
                    className="edit-tag-chip"
                  />
                ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseTagModal} color="primary">
                닫기
              </Button>
            </DialogActions>
          </Dialog>
  
          {/* Confirmation Modal */}
          <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
            <DialogTitle>확인</DialogTitle>
            <DialogContent className="dialog-content">
              <p>프로필을 저장하시겠습니까?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmModal(false)} color="primary">
                취소
              </Button>
              {/* <Button onClick={handleTagsConfirm} color="primary">
                저장
              </Button> */}
            </DialogActions>
          </Dialog>
          <div className="submit-area">
            <button type="submit" className="submit-button">
              회원가입
            </button>
          </div>
        </form>
      </div>

      {/* 서약서 모달 */}
      <Dialog open={openAgreementModal} onClose={handleCloseAgreementModal}>
        <DialogContent className="dialog-content">
          <h1>서약서</h1>
          <p>
            사용자는 안전한 음주문화를 위하여 다음과 같은 규칙을 준수해야 합니다.
          </p>
          <br />
          <p>첫째, 불순한 목적으로 타인과 접촉할 시, 법적 처벌을 받을 수 있습니다.</p>
          <p>타인이 원하지 않는 행동을 하는 것은 범죄임을 인지하십시오.</p>
          <br />
          <p>둘째, 사람이 많고 밝은 곳에서 모임을 진행하십시요.</p>
          <p>안전한 귀가와 범죄 예방을 위하여 위험 시 도움을 청할 수 있는 장소에서 모임을 진행하십시오.</p>
          <br />
          <p>셋째, 음란하거나 사회에 혼란을 줄 수 있는 게시물 작성을 금지합니다.</p>
          <p>부적합한 게시물을 작성할 경우 계정 삭제 조치 됩니다.</p>
          <br />
          {/* 서약서 내용 */}
          <input
            type="checkbox"
            checked={isAgreementChecked}
            onChange={() => setIsAgreementChecked(!isAgreementChecked)}
            required
          />
          &nbsp;위와 같은 규칙을 지키기로 서약합니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAgreementModal} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>     

    </div>
  );
};

export default Signup;