import React, { useState } from 'react';
import './DTBoard.css';
import DTBoardContent from './DTBoardContent';
import DTBoardMap from './DTBoardMap';

const DTBoard = () => {
  const posts = [
    { id: 1, title: '호수공원 벤치에서 맥주드실분', description: 'Menu description.' },
    { id: 2, title: '다운타운에서 맥주 같이드실분', description: 'Menu description.' },
    { id: 3, title: '피맥 조지실분 선착순 3명 구합니다', description: '피자네버슬립스-잠실점 | 2024.07.03 6:30pm' },
    { id: 4, title: '곱소하실분 - 나루역 4출 4명', description: 'Menu description.' },
    { id: 5, title: '참치 배터지게 드실분있나요?', description: 'Menu description.' },
    { id: 6, title: 'dumi 1', description: 'dumi1'},
    { id: 7, title: 'dumi 2', description: 'dumi2'},
    { id: 8, title: 'dumi 3', description: 'dumi3'},
    { id: 9, title: 'dumi 4', description: 'dumi4'},
    { id: 10, title: 'dumi 5', description: 'dumi5'},
    { id: 12, title: 'dumi 6', description: 'dumi6'},
    { id: 13, title: 'dumi 7', description: 'dumi7'},
    { id: 14, title: 'dumi 8', description: 'dumi8'},
    { id: 15, title: 'dumi 9', description: 'dumi9'},
    { id: 16, title: 'dumi 10', description: 'dumi10'},
    { id: 17, title: 'dumi 11', description: 'dumi11'},
    { id: 18, title: 'dumi 12', description: 'dumi12'},
  ];
  
  
  //페이지 설정-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const[currentPage, setCurrentPage] = useState(1);   //현재 페이지의 기본값을 1로 한다.
  const postsPerPage = 7;  //한 페이지에 표시할 포스트의 수.
 
  const indexOfLastPost = currentPage * postsPerPage;  //페이지의 마지막 게시물 index
  const indexOfFirstPost = indexOfLastPost - postsPerPage;  //페이지의 첫 번째 게시물 index
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); //post배열에서 indexOfFirstPost(포함) 부터 indexOfLastPost(미포함) 전 까지 자른다.
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);	// paginate의 페이지넘버 = 현제페이지넘버로 한다.
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
  return (
    <div className="board-layout">
      <div className="board-content">
      	{/* totalPost / postsPerPage로 총 페이지 수 구함 -> DTBoardContents의 */}
        <DTBoardContent posts={currentPosts} totalPosts={posts.length} postsPerPage={postsPerPage} paginate={paginate} />
        <DTBoardMap />
      </div>
    </div>
  );
};

export default DTBoard;
