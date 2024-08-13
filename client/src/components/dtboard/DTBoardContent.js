import React, {useState} from 'react';
import profileImg from '../images/noimage.jpg';
import UseAuthorImages from '../images/UseAuthorImage';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import Skeleton from '@mui/material/Skeleton';
import useToProfile from '../../hooks/useToProfile';

const DTBoardContent = ({ posts, totalPosts, postsPerPage, paginate, onWriteButtonClick, onPostClick }) => {
  const pageNumbers = [];
  const authorImages = UseAuthorImages(posts);
  const [loadedImages, setLoadedImages] = useState({});
  const navigateToUserProfile = useToProfile();

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) { // Math.ceil로 계산한 값을 올림하여 필요한 페이지 수를 구한다.
    pageNumbers.push(i); // 계산한 페이지 수를 1~n까지 구해 pageNumbers에 넣고 pagination으로 연결해 표시한다.
  }

  const handleImageLoad = (authorId) => {
    setLoadedImages(prevState => ({ ...prevState, [authorId]: true }));
  };

  //console.log(posts);
  return (
    <>
      <div className="dt-left">
        <div className="board-left">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <div className="postClickArea" onClick={() => onPostClick(post.id)}>
                <div className='post-img-nick' onClick={()=>navigateToUserProfile(post.author_id)}>
                <img
                    src={authorImages[post.author_id] || <Skeleton variant="circular" height={25} width={25} />}
                    alt="img"
                    className="rounded-circle mr-3"
                    style={{ 
                      width: '25px', 
                      height: '25px', 
                      display: loadedImages[post.author_id] ? 'block' : 'none' 
                    }}
                    onLoad={() => handleImageLoad(post.author_id)}
                  />
                  {!loadedImages[post.author_id] && (
                    <Skeleton variant="circular" height={25} width={25} />
                  )}
                  <div className="dt-post-nick">{post.nickname}</div>
                </div>
                <div className='dtpostHeader'>
                  <div className="dtpost-title">{post.title}</div>
                  <div className='dticonBox'>
                    <Favorite className='likeIcon'  style={{ fontSize: '20px' }}/>
                    <span>{post.like}</span>
                    <Visibility className='viewIcon'  style={{ fontSize: '20px' }}/>
                    <span>{post.views}</span>
                  </div>
                </div>
                <div className="dtpost-location">{post.location}</div>
                <div className="dtpost-time">{post.time}</div>
                <div className='contentHidden'>{post.content}</div>
                <div className='contentHidden'>{post.address}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="board-footer">
          <div className="pagination">
            {pageNumbers.map(number => (
              <a key={number} onClick={(e) => { e.preventDefault(); paginate(number); }} href="!#" className="page-link">
                {number}
              </a>
            ))}
          </div>
          <div className="footerRight">
            <button className="write-button" onClick={onWriteButtonClick}>게시글 작성</button>
          </div>
        </div>
      </div>
    </>

  );
};

export default DTBoardContent;
