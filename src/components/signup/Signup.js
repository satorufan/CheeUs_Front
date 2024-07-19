// SignupForm.js
import { useContext, useEffect, useState } from 'react';
import './Signup.css';
import { AuthContext } from '../login/OAuth';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { updateUserLocation } from '../../store/ProfileSlice';
import { useDispatch, useSelector } from 'react-redux';

const Signup = () => {
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
  const [isLocationChecked, setIsLocationChecked] = useState(false);
  const [isMatchingChecked, setIsMatchingChecked] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);	
  const [intro, setIntro] = useState('');
  const [photos, setPhotos] = useState([]); //썸네일
  const [imageFiles, setImageFiles] = useState([]); //실제로 저장될 이미지파일
  //발행한 토큰의 이메일 정보 불러오기
  const {token} = useContext(AuthContext);


  const buttonStyleMale = {
    backgroundColor: gender === 0 ? 'gray' : 'white',
    color : 'black'
  };
  const buttonStyleFemale = {
    backgroundColor: gender === 1 ? 'gray' : 'white',
    color : 'black'
  };
  
  const sendPhotos = async () => {
    try {
      console.log('Upload successful');
    } catch (error) {

      console.error('Error uploading files:', error);
    }
  }

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

    //
    setNicknameChecked(true);
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
                console.log('위도:', location.latitude.toString());
                console.log('경도:', location.longitude);
            },
            (error) => {
                console.error('위치 정보를 가져오는 데 실패했습니다:', error);
            }
        );
    } else {
        console.error('Geolocation이 지원되지 않습니다');
    }
  };

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
        locationOk : isLocationChecked,
        latitude : userLocation ? userLocation.latitude.toString() : null,
        longitude : userLocation ? userLocation.longitude.toString() : null,
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
                            multiple
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
                  
                  <button type="button" onClick={sendPhotos}>전송</button>
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
              <label>음주 취향 태그</label>
              <input type="text" placeholder="+ 음주 취향 태그 추가" />
            </div>
            {/* <div className="form-group">
              <label>프로필 사진</label>
              <input type="file" onChange={handleImageChange} />
              {profileImage && <img src={profileImage} alt="프로필 사진" className="profile-image" />}
            </div> */}
            
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
	                  onChange={() => setIsLocationChecked(!isLocationChecked)}
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
