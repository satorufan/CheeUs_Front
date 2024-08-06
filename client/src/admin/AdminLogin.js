import * as React from 'react';
import { useState } from 'react';
import './Admin.css';
import axios from 'axios';
import { useLogin, useNotify, Notification } from 'react-admin';

const AdminLogin = ({theme}) => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/adminlogin', { id: email, password });
            localStorage.setItem('token', response.data.token);
            await login({email, password});
            notify('로그인 성공!')
        } catch (error) {
            notify('이메일 또는 비밀번호가 올바르지 않습니다.')
        }
    };


    return (
		<div className = "adminLoginContainer">
			<div className = "LoginArea">
				<div  className = 'adminLoginHeader'>
					<h2>Admin Login</h2>
				</div>
				<div className = 'adminLoginBox'>
			        <form onSubmit={handleSubmit} className = "adminLoginForm">
			        	<div className = "adminInfo">
			        		<div className = "adminId">
					            <input
					            	placeholder='이메일을 입력해주세요'
					                name="email"
					                type="email"
					                value={email}
					                onChange={e => setEmail(e.target.value)}
					            />
				            </div>
				            <div className = "adminPasswd">
					            <input
					            	placeholder='비밀번호를 입력해주세요'
					                name="password"
					                type="password"
					                value={password}
					                onChange={e => setPassword(e.target.value)}
					            />
				            </div>
			            </div>
			            <button className='btn btn-primary' type="submit">Login</button>
			        </form>
		        </div>
	        </div>
        </div>
    );
};

export default AdminLogin;
