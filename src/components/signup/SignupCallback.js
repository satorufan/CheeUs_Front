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

    const serverUrl = "http://localhost:8080";
    const navigate = useNavigate();
    const callbackData = useLocation();
    const {memberProfileDetail} = callbackData.state || {};

    useEffect(()=>{

        console.log(memberProfileDetail);
        axios.post(serverUrl + '/member/signUp', memberProfileDetail)
        .then((res)=>{
            console.log(res);
            navigate('/');
        })
        .catch((err)=>{
            console.log(err);
        })

    })

    return (
        <div>
            
        </div>
    );
};

export default SignupCallback;
