// SignCallback.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../login/OAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SignupCallback = () => {
    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        });
    };
    const [signUp, setUp] = useState(false);
    const {token, requestSignIn} = useContext(AuthContext);

    const serverUrl = "http://localhost:8080";
    const navigate = useNavigate();
    const callbackData = useLocation();
    const {memberProfileDetail} = callbackData.state || {};

    useEffect(()=>{
        setUp(true);
    },[]);

    useEffect(()=>{

        console.log(token);
        if (signUp) {
            axios.post(serverUrl + '/member/signUp', memberProfileDetail)
            .then((res)=>{
                console.log(res);
                sweetalert("환영합니다!", "", "", "확인");
                requestSignIn();
                navigate('/');
            })
            .catch((err)=>{
                console.log(err);
            });
        }

    }, [signUp])

    return (
        <div>
            
        </div>
    );
};

export default SignupCallback;
