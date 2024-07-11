//Login.js
import React, { useState, useContext } from 'react';
import { GOOGLE_AUTH_URL, KAKAO_AUTH_URL, NAVER_AUTH_URL } from './OAuth';
import kakaoLoginImage from '../images/kakao_login_medium_wide.png';
import googleLoginImage from '../images/web_light_sq_SU@2x.png';
import naverLoginImage from '../images/btnG_완성형.png';
import './Login.css';

const Login = () => {
	
  return (
    <div className="login-container">
    	<div className='login-box'>
    	<h2>CHEEUS 회원가입</h2>
    	<div>소셜 로그인으로 간편하게 가입할 수 있습니다.<br/><br/>
    	---------------------------------------------------------------------------<br/>
    	</div>
	     	<a  href = {KAKAO_AUTH_URL}>
	     		<img src = {kakaoLoginImage} alt = "카카오계정 로그인"/>
	     	</a><br/>
	     	{/* <a  href = {GOOGLE_AUTH_URL} className = 'logo'>
	      		<img src = {googleLoginImage} alt = "구글계정 로그인" />
	     	</a><br/> */}
			<a  href = {"http://localhost:8080/member/signIn"} className = 'logo'>
	      		<img src = {googleLoginImage} alt = "구글계정 로그인" />
	     	</a><br/>
	     	<a  href = {NAVER_AUTH_URL} className='logo'>
	      		<img src = {naverLoginImage} alt = "구글계정 로그인" />
	     	</a><br/><br/>
	     	<div>
	     	---------------------------------------------------------------------------
	     	</div>
     	</div>
    </div>
  );
};

export default Login;