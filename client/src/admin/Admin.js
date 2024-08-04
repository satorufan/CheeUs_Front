import React from "react";
import './Admin.css';
import { useNavigate } from "react-router-dom";

const Admin = () =>{
	const navigate = useNavigate();
	const userButton = ()=>{
		navigate('/admin/users');
		return;
	};
	const postButton = ()=>{
		navigate('/admin/posts');
		return;
	};
	
	
	return(
	<div className = 'adminPage'>
		<div className = 'adminHeader'>
			<h2>Admin home</h2>
		</div>
		<div className = 'adminContainer'>
			<div className = 'buttonContainer'>
				<button onClick = {userButton}>Users</button>
				<button onClick = {postButton}>Posts</button>
			</div>
		</div>
	</div>
	);
};

export default Admin;
