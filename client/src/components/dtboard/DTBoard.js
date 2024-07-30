import React, { useState } from 'react';
import './DTBoard.css';
import DTBoardContent from './DTBoardContent';
import DTBoardMap from './DTBoardMap';
import { useNavigate } from 'react-router-dom';
import { usePosts } from './PostContext';

const DTBoard = () => {
  const { posts } = usePosts();
  const navigate = useNavigate();

  // 페이지 설정
  const [currentPage, setCurrentPage] = useState(1);   // 현재 페이지의 기본값을 1로 한다.
  const postsPerPage = 7;  // 한 페이지에 표시할 포스트의 수.

  const indexOfLastPost = currentPage * postsPerPage;  // 페이지의 마지막 게시물 index
  const indexOfFirstPost = indexOfLastPost - postsPerPage;  // 페이지의 첫 번째 게시물 index
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // post 배열에서 indexOfFirstPost(포함)부터 indexOfLastPost(미포함) 전까지 자른다.

  const paginate = (pageNumber) => setCurrentPage(pageNumber); // paginate의 페이지넘버 = 현재 페이지 넘버로 한다.

  const [selectedPostId, setSelectedPostId] = useState(null); // 공통 상태로 선택된 게시물 ID를 저장

  return (
    <div className="board-layout">
      <div className="board-content">
        <DTBoardContent
          posts={currentPosts}
          totalPosts={posts.length}
          postsPerPage={postsPerPage}
          paginate={paginate}
          onWriteButtonClick={() => navigate('/dtboard/input')}
          onPostClick={(id) => setSelectedPostId(id)} // 게시물 클릭 시 선택된 게시물 ID를 설정
        />
        <DTBoardMap selectedPostId={selectedPostId} /> {/* 선택된 게시물 ID를 전달 */}
      </div>
    </div>
  );
};

export default DTBoard;
