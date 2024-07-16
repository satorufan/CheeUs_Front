// SignupForm.js
import { useContext, useEffect, useState } from 'react';
import './Signup.css';
import { AuthContext } from '../login/OAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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
  const [profileImage, setProfileImage] = useState(null);
  //발행한 토큰의 이메일 정보 불러오기
  const {token} = useContext(AuthContext);
  const memberEmail = jwtDecode(token).email;

  const buttonStyleMale = {
    backgroundColor: gender === 0 ? 'gray' : 'white', // 남자일 때는 파란색, 여자일 때는 분홍색
    color : 'black'
  };
  const buttonStyleFemale = {
    backgroundColor: gender === 1 ? 'gray' : 'white', // 남자일 때는 파란색, 여자일 때는 분홍색
    color : 'black'
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const nicknameCheck = (nickname) => {
    //axios 들어갈 자리

    //
    setNicknameChecked(true);
  }

  const handleComplete = async (event) => {
    event.preventDefault();

    if (name == null) {
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
      const memberProfileDetail = {
        email : memberEmail,
        name : name,
        birth : birth,
        tel : tel,
        nickname : nickname,
        gender : gender,
        locationOk : isLocationChecked,
        matchOk : isMatchingChecked,
        intro : intro
      };

      navigate('/signupcallback', {state : {memberProfileDetail}});
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleComplete}>
        <div className="form-sections">
          <div className="left-section">
            <div className="form-group">
              <label>이메일(ID)</label>
              <input type="text" value={memberEmail} readOnly/>
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
          </div>
          
          <div className="right-section">
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
              	<label>프로필 사진</label>
             	 <input type="file" onChange={handleImageChange} />
              	{profileImage && <img src={profileImage} alt="프로필 사진" className="profile-image" />}
            </div>
            <div className="form-group">
              <label>음주 취향 태그</label>
              <input type="text" placeholder="+ 음주 취향 태그 추가" />
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
            <div className="submit-area">
      			<button type="submit" className="submit-button" >Submit</button>
      		</div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
