// SignCallback.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../login/OAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Spinner from 'react-bootstrap/Spinner';

const SignupCallback = () => {
    const [signUp, setUp] = useState(false);
    const {token, requestSignIn} = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    const serverUrl = "http://localhost:8080";
    const navigate = useNavigate();
    const callbackData = useLocation();
    const {memberProfileDetail, imageFiles} = callbackData.state || {};

    useEffect(()=>{
        setUp(true);
    },[]);

    useEffect(()=>{

        if (signUp) {
            
            const formData = new FormData();

            // formData에 JSON 객체를 보내려면 아래처럼 해야함.
            formData.append("memberProfileDetail",
                new Blob([JSON.stringify(memberProfileDetail)], 
                {type: 'application/json'})
            );

            imageFiles.forEach(async (files, index) => {
                formData.append("photos", files);
                formData.append("email", jwtDecode(token).email + "/" + index);
            });

            axios.post(serverUrl + '/member/signUp', formData, {
                headers : {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res)=>{
                navigate("/logincallback");
                window.location.reload();
            })
            .catch((err)=>{
                setLoading(false);
                console.log(err);
            });
        }

    }, [signUp])

    return (
        <div className="permissionMessage">
            {loading ? (
                <div>
                    로딩중...
                    <div>
                        <Spinner animation="border" variant="dark" />
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default SignupCallback;
