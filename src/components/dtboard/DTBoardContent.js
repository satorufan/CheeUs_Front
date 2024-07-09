import React from 'react';

const DTBoardContent = ({ posts, totalPosts, postsPerPage, paginate }) => {
	
  const pageNumbers =[];
  
  for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++){ //Math.ceil로 계산한 값을 올림하여 필요한 페이지 수를 구한다.
	  pageNumbers.push(i);	//계산한 페이지 수를 1~n까지 구해 pageNumbers에 넣고 pagenation으로 연결해 표시한다.
  }
  
  return (
    <div className="board-left">
      <h2>함께 마셔요 게시판</h2>
      <hr className="divider" />
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h5>{post.title}</h5>
          <p>{post.description}</p>
          <hr className="divider" />
        </div>
      ))}
      {/*-----------페이지네이션, 게시물 작성버튼 설정---------------------------------------------------------------------------------------------------------------------------------- */}
      <div className="board-footer">
        <div className="pagination">
		 {pageNumbers.map(number => (
            <a key={number} onClick={(e) => { e.preventDefault(); paginate(number); }} href="!#" className="page-link">
              {number}          {/*페이지 넘버를 key값으로 하며, preventDefault와 !#로 페이지 새로고침 막으면서  paginate를 호출하여 페이지를 변경한다.*/}
            </a>
		 ))}        
        </div>
        <button className="write-button">게시글 작성</button>
      </div>
    </div>
  );
};

export default DTBoardContent;
