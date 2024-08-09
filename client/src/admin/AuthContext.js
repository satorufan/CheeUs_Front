import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminToken, setAdminToken] = useState();

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    const tokenCheck = ()=>{
        const loadToken = getJwtToken();
        if (loadToken) {
            setAdminToken(loadToken);
            axios.get("http://localhost:8080/adminlogin/tokenCheck", {
                headers : {
                    'Authorization' : `Bearer ${loadToken}`
                },
                withCredentials : true
            }).then((res)=>{
                console.log(res);
                login();
            })
            .catch((err)=>{
                console.log(err);
                logout();
                setAdminToken(null);
                window.location.reload();
            })
        } else {
            logout();
            setAdminToken(null);
        }
    };

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
        <AuthContext.Provider value={{ isLoggedIn, login, logout, adminToken, tokenCheck }}>
            {children}
        </AuthContext.Provider>
    );
};
