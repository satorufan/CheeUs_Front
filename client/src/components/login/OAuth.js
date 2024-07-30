//OAuth.js

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

//카카오 로그인 //https://data-jj.tistory.com/53
//구글 로그인 //https://velog.io/@049494/%EA%B5%AC%EA%B8%80-%EB%A1%9C%EA%B7%B8%EC%9D%B8
//네이버 로그인 //https://choijying21.tistory.com/entry/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%86%8C%EC%85%9C%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0%ED%94%84%EB%A1%A0%ED%8A%B8-%EB%B6%80%EB%B6%84-%EB%84%A4%EC%95%84%EB%A1%9C
const KAKAO_CLIENT_ID = "63c6039a01c876b3b06fce128099211a";
const KAKAO_REDIRECT_URI = "http://localhost:3000/oauth/callback/kakao"
const GOOGLE_CLIENT_ID = "535312439957-tkn989gb4tuvmc4ed9d04e4uunpseian.apps.googleusercontent.com"
const GOOGLE_REDIRECT_URI = "http://localhost:3000/oauth/callback/google"
const NAVER_CLIENT_ID = "j9ui7lVJIo0tLXyfD9Mr"
const NAVER_REDIRECT_URI = "http://localhost:3000/oauth/callback/naver"
const STATE = "false";

export const KAKAO_AUTH_URL =`https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}
													&redirect_uri=${KAKAO_REDIRECT_URI}
													&response_type=code`
export const GOOGLE_AUTH_URL =`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}
													&redirect_uri=${GOOGLE_REDIRECT_URI}
													&response_type=code
													&scope=email profile`
export const NAVER_AUTH_URL =`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}
													&state=${STATE}
													&redirect_uri=${NAVER_REDIRECT_URI}`

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [memberEmail, setEmail] = useState('');
	const [token, setToken] = useState('');
	const serverUrl = "http://localhost:8080";

	useEffect(()=>{
		const loadToken = getJwtToken();
		if (loadToken) {
			setToken(loadToken);
			axios.get(serverUrl + "/member/signIn", {params : {
				email : jwtDecode(loadToken).email
			}}).then((res)=>{
				setEmail(jwtDecode(loadToken).email);
			}).catch((err)=>{
				console.log(err);
			});
		}
	}, []);

	//로그인
	const requestSignIn = () => {
		const loadToken = getJwtToken();
		setToken(loadToken);
		setEmail(jwtDecode(loadToken).email);
	}

	//로그아웃
	const requestSignOut = () => {
		setToken(null);
		setEmail(null);
		window.location.href = serverUrl+"/logout";
		console.log("로그아웃")
	}

	//쿠키에서 JWT 토큰 불러오기.
	const getJwtToken = () => {
		const cookies = document.cookie.split('; ');
		for (let cookie of cookies) {
		  const [name, value] = cookie.split('=');
		  if (name === 'Authorization') {
			return decodeURIComponent(value);
		  }
		}
		return null;
	}

	return (
	<AuthContext.Provider value={{ 
		serverUrl,
		memberEmail,
		setEmail,
		token,
		setToken, 
		getJwtToken, 
		requestSignIn,
		requestSignOut
		}}>
		{children}
	</AuthContext.Provider>
	);
	
}

export {AuthContext, AuthProvider};