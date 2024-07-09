// SignupForm.js
import { useState } from 'react';
import './Signup.css';

const Signup = () => {
  const [isLocationChecked, setIsLocationChecked] = useState(false);
  const [isMatchingChecked, setIsMatchingChecked] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);	
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form">
        <div className="form-sections">
          <div className="left-section">
            <div className="form-group">
              <label>이메일(ID)</label>
              <input type="text" placeholder="oauth로 채워짐" />
            </div>
            <div className="form-group">
              <label>이름</label>
              <input type="text" placeholder="oauth로 채워짐" />
            </div>
            <div className="form-group">
              <label>생년월일</label>
              <input type="text" placeholder="oauth로 채워짐" />
            </div>
            <div className="form-group">
              <label>전화번호</label>
              <input type="text" placeholder="oauth로 채워짐" />
            </div>
            <div className="form-group">
              <label>성별</label>
              <div className="gender-buttons">
                <button type="button">남</button>
                <button type="button">여</button>
              </div>
            </div>
          </div>
          
          <div className="right-section">
            <div className="form-group">
              <label>닉네임</label>
              <div className="nickname-group">
                <input type="text" placeholder="닉네임을 입력하세요 (변경불가)" />
                <button type="button" className="check-button">중복확인</button>
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
              <textarea placeholder="자기소개를 입력하세요"></textarea>
            </div>
            <div className="submit-area">
      			<button type="submit" className="submit-button">Submit</button>
      		</div>
        </div>
      </form>
    </div>
  );
};

export default Signup;
