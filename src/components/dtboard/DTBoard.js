import React from 'react';
import './DTBoard.css';
import DTBoardContent from './DTBoardContent';
import DTBoardMap from './DTBoardMap';
import { useNavigate } from 'react-router-dom';
import { usePosts } from './PostContext';

const DTBoard = () => {
  const { posts } = usePosts();
  const navigate = useNavigate();
  
  //페이지 설정-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const [currentPage, setCurrentPage] = React.useState(1);   //현재 페이지의 기본값을 1로 한다.
  const postsPerPage = 7;  //한 페이지에 표시할 포스트의 수.
 
  const indexOfLastPost = currentPage * postsPerPage;  //페이지의 마지막 게시물 index
  const indexOfFirstPost = indexOfLastPost - postsPerPage;  //페이지의 첫 번째 게시물 index
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); //post배열에서 indexOfFirstPost(포함) 부터 indexOfLastPost(미포함) 전 까지 자른다.
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);	// paginate의 페이지넘버 = 현제페이지넘버로 한다.
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  return (
    <div className="board-layout">
      <div className="board-content">
        <DTBoardContent
          posts={currentPosts}
          totalPosts={posts.length}
          postsPerPage={postsPerPage}
          paginate={paginate}
          onWriteButtonClick={() => navigate('/dtboard/input')}
        />
        <DTBoardMap />
      </div>
    </div>
  );
};

export default DTBoard;
