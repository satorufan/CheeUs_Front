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


  const buttonStyleMale = {
    backgroundColor: gender === 0 ? 'gray' : 'white',
    color : 'black'
  };
  const buttonStyleFemale = {
    backgroundColor: gender === 1 ? 'gray' : 'white',
    color : 'black'
  };

  // photos에 입력받은 사진 임시 저장
  const handleUploadPhoto = (index) => (event) => {
    const file = event.target.files[0];

    if (file) {
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
    axios.get(serverUrl + '/profile/checkNickname', {params : {
      nickname : nickname
    }}).then((res) => {
      sweetalert("사용가능한 닉네임입니다." ,"","","확인");
      setNicknameChecked(true);
    }).catch((err)=>{
      sweetalert(err.response.data.message ,"","","확인");
    });
    //
  }

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
    setTags((prevTags) => 
        prevTags.includes(tag)
            ? prevTags.filter((t) => t !== tag)
            : [...prevTags, tag]
    );
  };
  const handleTagSubmit = () => {
    var tagsString = "";
    tags.map((tag)=>{
      tagsString += tag + "/";
    });
    return tagsString;
  }

  // 제출 - 회원가입 요청
  const handleComplete = async (event) => {
    event.preventDefault();
    console.log("submit");

    if (photos.length == 0) {
      sweetalert("프로필 사진 한 장 이상 추가하여야 합니다", '','','확인');
    } else if (name == null) {
      sweetalert("이름을 입력해주세요!", '','','확인');
    } else if (birth == null || 
      birth.length != 8 || !/^\d*$/.test(birth)
    ) {
      sweetalert("생일을 정확히 입력해주세요!", '','','확인');
    } else if (tel == null || 
      tel.length != 11 || !/^\d*$/.test(tel)
    ) {
      sweetalert("전화번호를 정확히 입력해주세요!", '','','확인');
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
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleComplete}>
        <div className="form-sections">
          <div className="left-section">
            <div className="form-group">
              <label>프로필 사진 ( 1개 이상 )</label>
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
                        <div className="add-photos" >
                            {photos[index] ? (
                              <>
                                <img src={photos[index]} alt={`Photo ${index + 1}`} className="edit-photo-thumbnail" />
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
                                  <div className="add-photo-placeholder" onClick={() => handleAddPhoto(index)}>
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

          
          <div className="right-section">
            <div className="form-group">
              <label>이메일(ID)</label>
              <input type="text" value={token ? jwtDecode(token).email : ""} readOnly/>
            </div>
            <div className="form-group">
              <label>이름</label>
              <input 
              type="text" 
              placeholder="이름을 입력하세요" 
              value={name}
              onChange={(event) => setName(event.target.value)}/>
            </div>
            <div className="form-group">
              <label>생년월일</label>
              <input 
              type="text"
              placeholder="생년월일을 입력하세요(ex. 20000101)" 
              value={birth}
              onChange={(event) => setBirth(event.target.value)}/>
            </div>
            <div className="form-group">
              <label>전화번호</label>
              <input type="text" 
              placeholder="전화번호를 입력하세요(ex. 01011112222)" 
              value={tel}
              onChange={(event) => setTel(event.target.value)}/>
            </div>
            <div className="form-group">
              <label>성별</label>
              <div className="gender-buttons">
                <button type="button" 
                onClick={()=>setGender(0)}
                style={buttonStyleMale}>남</button>
                <button type="button" 
                onClick={()=>setGender(1)}
                style={buttonStyleFemale}>여</button>
              </div>
            </div>
            <div className="form-group">
              <label>닉네임</label>
              <div className="nickname-group">
                <input type="text" 
                placeholder="닉네임을 입력하세요 (변경불가)" 
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}/>
                <button type="button" className="check-button" onClick={() => nicknameCheck(nickname)}>중복확인</button>
              </div>
            </div>
            <div className="form-group">
                <button type="button" onClick={handleOpenTagModal} variant="outlined" className='edit-tags-btn'>
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
        <div className="bottom-section">
          <div className="form-group">
              <label>자기소개</label>
              <textarea 
              placeholder="자기소개를 입력하세요"
              onChange={(event) => setIntro(event.target.value)}></textarea>
      		</div>
          <div className="form-group">
              <label>사용자정보 동의</label>
              <div className='agreement-group'>
	              <label className='agreement'>
	              	위치정보 제공 동의
	              	<input 
	                  type="checkbox" 
	                  checked={isLocationChecked} 
	                  onChange={() => {
                      setIsLocationChecked(!isLocationChecked)
                      getUserLocation()
                    }}
	                />
	              </label>
	              <label className='agreement'>
	              	1:1 매칭 프로그램 사용 동의
	              	<input 
	                  type="checkbox" 
	                  checked={isMatchingChecked} 
	                  onChange={() => setIsMatchingChecked(!isMatchingChecked)}
	                />
	              </label>
	              <label className="agreement">
	                안전한 웹서비스 이용 서약서
	                <input 
	                  type="checkbox" 
	                  checked={isAgreementChecked} 
	                  onChange={() => setIsAgreementChecked(!isAgreementChecked)}
	                />
	              </label>
                
            </div>
            {/* 태그 모달 */}
            <Dialog open={openTagModal} onClose={handleCloseTagModal}>
                <DialogTitle>음주 선호 태그</DialogTitle>
                <DialogContent>
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
                <DialogContent>
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
      			<button type="submit" className="submit-button" >Submit</button>
              </div>
            </div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
