import * as React from 'react';
import { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import './Admin.css';

const AdminLogin = () => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = e => {
        e.preventDefault();
        login({ email, password }).catch(() =>
            notify('Invalid email or password')
        );
    };

    return (
		<div className = "adminLoginContainer">
			<div className = 'adminLoginBox'>
		        <form onSubmit={handleSubmit} className = "adminLoginForm">
		        	<div className = "adminInfo">
		        		<div className = "adminId">
				            <input
				                name="email"
				                type="email"
				                value={email}
				                onChange={e => setEmail(e.target.value)}
				            />
			            </div>
			            <div className = "adminPasswd">
				            <input
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
    );
};

export default AdminLogin;
