// Login.js
import React, { useContext } from 'react';
import { AuthContext, GOOGLE_AUTH_URL, KAKAO_AUTH_URL, NAVER_AUTH_URL } from './OAuth';
import kakaoLoginImage from '../images/kakao.png';
import googleLoginImage from '../images/google.png';
import naverLoginImage from '../images/naver.png';
import './Login.css';

const Login = () => {

	const {serverUrl, requestSignOut} = useContext(AuthContext);
	
	const loginBtn = (registrationId) => {
		requestSignOut();
		window.location.href = `${serverUrl}/oauth2/authorization/${registrationId}`;
	}

	return (
		<div className="login-container">
			<div className='login-box'>
				<h2>CHEEUS 회원가입</h2>
				<div>소셜 로그인으로 간편하게 가입할 수 있습니다.<br/><br/></div>
					<a  style={{cursor : 'pointer'}}	className = 'logo'>
						<img src = {kakaoLoginImage} alt = "카카오계정 로그인" onClick={()=>loginBtn("kakao")} />
					</a><br/>
					{/* <a  href = {GOOGLE_AUTH_URL} className = 'logo'>
						<img src = {googleLoginImage} alt = "구글계정 로그인" />
					</a><br/> */}
					<a  style={{cursor : 'pointer'}}	className = 'logo'>
						<img src = {googleLoginImage} alt = "구글계정 로그인" onClick={()=>loginBtn("google")} />
					</a><br/>
					<a  style={{cursor : 'pointer'}}	className='logo'>
						<img src = {naverLoginImage} alt = "네이버 계정 로그인" onClick={()=>loginBtn("naver")} />
					</a><br/><br/>
				<div>
					<hr className="divider" />
					<div>
					계정이 없다면 소셜계정으로 회원가입해주세요!
					</div>
				</div>
			</div>
		</div>
  	);
};

export default Login;
