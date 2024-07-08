//Login.js
import React, { useState, useContext } from 'react';
import { GOOGLE_AUTH_URL, KAKAO_AUTH_URL, NAVER_AUTH_URL } from './OAuth';
import kakaoLoginImage from '../images/kakao.png';
import googleLoginImage from '../images/google.png';
import naverLoginImage from '../images/naver.png';
import './Login.css';

const Login = () => {
	
  return (
    <div className="login-container">
    	<div className='login-box'>
    	<h2>CHEEUS 회원가입</h2>
    	<div>소셜 로그인으로 간편하게 가입할 수 있습니다.<br/><br/>
    	---------------------------------------------------------------------------<br/>
    	</div>
	     	<a  href = {KAKAO_AUTH_URL} className = 'logo'>
	     		<img src = {kakaoLoginImage} alt = "카카오계정 로그인"/>
	     	</a><br/>
	     	<a  href = {GOOGLE_AUTH_URL} className = 'logo'>
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