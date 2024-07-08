import React from 'react';

const DTBoardContent = ({ posts }) => {
  return (
    <div className="board-left">
      <h2>위치검색</h2>
      <h3>함께마셔요 게시판</h3>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h4>{post.title}</h4>
          <p>{post.description}</p>
        </div>
      ))}
      <div className="board-footer">
        <div className="pagination">Previous 1 2 3 Next</div>
        <button className="write-button">게시글 작성</button>
      </div>
    </div>
  );
};

export default DTBoardContent;
