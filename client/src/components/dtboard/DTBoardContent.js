import React from 'react';
import profileImg from '../images/noimage.jpg';
import UseAuthorImages from '../images/UseAuthorImage';

const DTBoardContent = ({ posts, totalPosts, postsPerPage, paginate, onWriteButtonClick, onPostClick }) => {
  const pageNumbers = [];
  const authorImages = UseAuthorImages(posts);


  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) { // Math.ceil로 계산한 값을 올림하여 필요한 페이지 수를 구한다.
    pageNumbers.push(i); // 계산한 페이지 수를 1~n까지 구해 pageNumbers에 넣고 pagination으로 연결해 표시한다.
  }

  //console.log(posts);
  return (
    <div className="board-left">
      {posts.map((post) => (
        <div key={post.id} className="post" > {/* 게시물 클릭 시 선택된 게시물 ID를 설정 */}
          <div className = "postClickArea" onClick={() => onPostClick(post.id)}>
            <div className='post-img-nick'>
              <img
                  src={authorImages[post.author_id] || profileImg}
                  alt={`img`}
                  className="rounded-circle mr-3"
                  style={{ width: '25px', height: '25px' }}
              />
              <div className="dt-post-nick">{post.nickname}</div>
            </div>
            <h5>{post.title}</h5>
            <div className="dtpost-location"> {post.location}</div>
            <div className="dtpost-time"> {post.time}</div>
            <div className='contentHidden'>{post.content}</div>
            <div className='contentHidden'>{post.address}</div>
          </div>
        </div>
      ))}
      <div className="board-footer">
      	<div className = "footerLeft">
	        <div className="pagination">
	          {pageNumbers.map(number => (
	            <a key={number} onClick={(e) => { e.preventDefault(); paginate(number); }} href="!#" className="page-link">
	              {number} {/* 페이지 넘버를 key값으로 하며, preventDefault와 !#로 페이지 새로고침 막으면서 paginate를 호출하여 페이지를 변경한다. */}
	            </a>
	          ))}
	        </div>
      </div>
      <div className = "footerRight">
	          <button className="write-button" onClick={onWriteButtonClick}>게시글 작성</button>
	      </div>
	  </div>
    </div>
  );
};

export default DTBoardContent;
