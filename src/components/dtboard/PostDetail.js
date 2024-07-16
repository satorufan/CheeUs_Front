import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { usePosts } from './PostContext';
import PostDetailMap from './PostDetailMap';
import '@toast-ui/editor/dist/toastui-editor.css';
import './DTBinputForm.css';
import 'react-datepicker/dist/react-datepicker.css';
import profileImg from '../images/google.png'

const PostDetail = () => {
  const { id } = useParams();
  const { posts } = usePosts();
  const post = posts.find((post) => post.id === parseInt(id));
  const navigate = useNavigate();

  if (!post) return <div>Post not found</div>;

  const onExitHandler = () => {
    navigate('/dtboard');
  };

  return (
    <div className="inputContainer">
      <div className="topContainer">
        <div className="textareaHeader">
          <div className = 'textarea'>{post.title}</div>
        </div>
        <div className="mapHeader">
          <div className="mapping">
            장소 : {post.description}
          </div>
        </div>
      </div>
      <div className="contentContainer" >
        <div className="mypageContainer" >
          <br/>
          <div className = 'contentHeader'>
	          <div className = "profileContainer">
	          	<div className='profile1'>
	          	  <img className = 'profileImg' src= {profileImg} alt='Profile'/>
	          	</div>
	          	<div className = 'profile2'>
	          	  <a>닉네임</a>
	          	</div>
	          </div>
	          <div className="dateHeader">
          		<a>약속시간 : {post.time}</a>
              </div>
          </div>
          <br/>        
          <div className='content'>{post.content}</div>
        </div>
        <div className="mapContainer" >
          <PostDetailMap lat={post.lat} lng={post.lng} title={post.title} description={post.description} />
        </div>
      </div>
      <div className="bottomContainer">
        <div className="buttonsWrap">
         <div className ='buttonArea1'>
          <button className="backButton" onClick={onExitHandler}>
            <div className="arrowWrap">
              <BsArrowLeft className="arrow" />
              <span className="arrowText">목록으로</span>
            </div>
          </button>
         </div>
         <div className = 'buttonArea2'>
          <button className="modifyButton" >
            글 수정
          </button>
          <button className="deleteButton" >
            글 삭제
          </button>
         </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
