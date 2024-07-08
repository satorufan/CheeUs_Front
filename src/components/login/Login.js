// Login.js
import React, { useState, useContext } from 'react';
import { GOOGLE_AUTH_URL, KAKAO_AUTH_URL, NAVER_AUTH_URL } from './OAuth';
import kakaoLoginImage from '../images/kakao.png';
import googleLoginImage from '../images/google.png';
import naverLoginImage from '../images/naver.png';
import './Login.css';
import Swal from 'sweetalert2';

const Login = () => {
  const sweetalert = (title, contents, icon, confirmButtonText) => {
    Swal.fire({
      title: title,
      text: contents,
      icon: icon,
      confirmButtonText: confirmButtonText
    });
  };

  const handleLogin = () => {
    sweetalert('로그인에 성공했습니다.', '', '', '확인');
  };

  return (
    <div className="login-container">
      <div className='login-box'>
        <h2>CHEE US 로그인</h2>
        <div>소셜로그인으로 간편하게 로그인할 수 있습니다.</div>
        <hr className="divider" />
        <a href={KAKAO_AUTH_URL} className='logo' onClick={handleLogin}>
          <img src={kakaoLoginImage} alt="카카오계정 로그인" />
        </a>
        <a href={NAVER_AUTH_URL} className='logo'>
          <img src={naverLoginImage} alt="네이버계정 로그인" />
        </a>
        <a href={GOOGLE_AUTH_URL} className='logo'>
          <img src={googleLoginImage} alt="구글계정 로그인" />
        </a>
        <hr className="divider" />
        <div>
          계정이 없다면 소셜계정으로 회원가입해주세요!
        </div>
      </div>
    </div>
  );
};

export default Login;
