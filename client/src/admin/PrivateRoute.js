//AuthContext의 isLoggedIn  state가 false인 경우(logout상태)  null을 반환하여 랜더링 x
//useLocation을 통해 /admin으로 시작하는 모든 경로가 강제로 /admin/adminlogin으로 이동됨

//state가 true인 경우 <Outlet/>을 랜더링함. >> index.js의 <PrivateRoute>테그 내부의
//하위 경로로 설정된 컴포넌트로 연결됨

import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = () => {
    const { isLoggedIn, tokenCheck } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        tokenCheck();
        if (!isLoggedIn && location.pathname.startsWith('/admin')) {
            navigate('/admin/adminlogin');
        }
        console.log(isLoggedIn);
    }, [isLoggedIn, location, navigate, tokenCheck]);

    return isLoggedIn ? <Outlet /> : null;
};

export default PrivateRoute;
