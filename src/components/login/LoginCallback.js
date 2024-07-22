// LoginCallback.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './OAuth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const LoginCallback = () => {
    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        });
    };

    const {requestSignIn, serverUrl, token} = useContext(AuthContext);
    const navigate = useNavigate();


    // 로그인 처리 및 유저 정보 찾기
    useEffect(()=>{
        if (token) {
            axios.get(serverUrl + "/member/signIn", {params : {
                email: jwtDecode(token).email
            }})
            .then((res=>{
                //정보가 DB에 있으면 바로 로그인.
                requestSignIn();
                navigate('/', {state : {logined : res.data.nickname}});
                window.location.reload();
            }))
            .catch((err)=>{
                //없으면 에러 메시지와 함께, 회원가입 페이지로 이동
                console.log(err.response.data.message);
                if (err.response.data.message == "존재하지 않는 이메일입니다.") {
                    sweetalert("회원가입 페이지로 이동합니다.", '','','확인');
                    navigate('/signup');
                }
            });
        }
    }, [token])

    return (
        <div className="login-container">
            
        </div>
    );
};

export default LoginCallback;
