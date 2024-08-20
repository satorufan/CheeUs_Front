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

    const {requestSignIn, requestSignOut, serverUrl, token} = useContext(AuthContext);
    const navigate = useNavigate();


    // 로그인 처리 및 유저 정보 찾기
    useEffect(()=>{
        window.scrollTo(0, 0);
        
        if (token) {
            axios.get(serverUrl + "/member/signIn", {
                params : {
                    email: jwtDecode(token).email
                },
                headers : {
                    "Authorization" : `Bearer ${token}`
                },
                withCredentials : true
            })
            .then((res=>{
                //정보가 DB에 있으면 바로 로그인.
                if (res.data == "존재하지 않는 이메일입니다.") {
                    const date = new Date();
					date.setTime(date.getTime() + (5 * 60 * 1000)); // 현재 시간에 5분을 추가합니다.
					const expires = `expires=${date.toUTCString()}`;
					document.cookie = `${"Authorization"}=${token}; ${expires};`;
                    sweetalert("회원가입 페이지로 이동합니다.", '','','확인');
                    navigate('/signup');
                } else if (res.data == "제한된 사용자입니다 ㅉㅉ") {
                    Swal.fire({
                        title : '제한된 사용자입니다',
                        text : '',
                        icon : 'error'
                    }).then((res)=>{
                        console.log(res);
                        requestSignOut();
                    });
                } else {
                    console.log(res)
                    requestSignIn(res.data.nickname);
                    navigate("/");
                }
            }))
            .catch((err)=>{
                //없으면 에러 메시지와 함께, 회원가입 페이지로 이동
                console.log(err);
                if (err.response.data.message == "존재하지 않는 이메일입니다.") {
                    const date = new Date();
					date.setTime(date.getTime() + (5 * 60 * 1000)); // 현재 시간에 5분을 추가합니다.
					const expires = `expires=${date.toUTCString()}`;
					document.cookie = `${"Authorization"}=${token}; ${expires};`;
                    sweetalert("회원가입 페이지로 이동합니다.", '','','확인');
                    navigate('/signup');
                }
                if (err.response.data.message == "제한된 사용자입니다 ㅉㅉ") {
                    Swal.fire({
                        title : '제한된 사용자입니다',
                        text : '',
                        icon : 'error'
                    }).then((res)=>{
                        console.log(res);
                        requestSignOut();
                    });
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
