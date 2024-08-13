import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './MagazineDetail.css';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import MagazineTop from './MagazineTop';
import { useMagazines } from './MagazineContext';
import { AuthContext } from '../login/OAuth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Swal from 'sweetalert2';
import { usePosts } from '../dtboard/PostContext';
import { Bookmark } from '@mui/icons-material';
import Spinner from 'react-bootstrap/Spinner';

const MagazineDetail = () => {
  const { category, id } = useParams();
  const { magazines, toggleLike } = useMagazines();
  const [data, setData] = useState(null);
  const { memberEmail, serverUrl, token } = useContext(AuthContext);
  const [isScrapped, setIsScrapped] = useState(false);
  const { addScrap, checkScrap } = usePosts();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (magazines && magazines.magazine) { // magazines 객체에 magazine 배열이 있는지 확인
      const magazineData = magazines.magazine.find(
          (magazine) => magazine.id.toString() === id && magazine.category === category
      ); // magazine 배열에서 id와 category가 일치하는 항목을 찾음
      setData(magazineData); // 찾은 데이터를 state에 설정
    }
  }, [category, id, magazines]);

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
          try {
              // Check if post is scrapped
              const isPostScrapped = await checkScrap(serverUrl, memberEmail, data.id, token, 4);
              setIsScrapped(isPostScrapped);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
        }
    };
    fetchData();
  }, [data, serverUrl, memberEmail, token]);

  useEffect(() => {
    if (magazines && magazines.magazine) {
      const magazineData = Object.values(magazines.magazine).find(magazine => magazine.id.toString() === id);
      setData(magazineData);
      setLiked(magazineData?.liked || false); // 초기 liked 상태 설정
      setLikeCount(magazineData?.like || 0); // 초기 like 카운트 설정
    }
  }, [id, magazines]);

  // 좋아요 관련
  const handleLikeClick = async () => {
    if (data) {
      try {
        const result = await toggleLike(serverUrl, data.id, token, memberEmail);
        setLiked(result.isLiked);
        setLikeCount(result.updatedLikeCount);
      } catch (error) {
        console.error('좋아요 토글 에러:', error);
      }
    }
  };
  
  const onScrapHandler = async () => {
    const scrapMessage = await addScrap(serverUrl, memberEmail, id, data.title, token, window.location.href, 4 );
    Swal.fire({
      title: `${scrapMessage}!`,
      icon: '',
      showCancelButton: true,
      confirmButtonColor: '#48088A',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    })
    setIsScrapped(!isScrapped);
  };

  if (!data) {
    return (
      <div className="permissionMessage">
        <div>로딩중...
          <div>
            <Spinner animation="border" variant="dark" />
          </div>
        </div>
      </div>
    );
  }

  const thumbnail = data.content.match(/!\[alt text]\(https:\/\/[^\s]+\)/)?.[0];

  console.log("썸네일?", thumbnail);



  return (
    <div className="magazine-detail-container">
      <MagazineTop/>
      <div className="magazine-detail-content">
        <h2 className="magazine-detail-title">{data.title}</h2>
        <p className="magazine-detail-date">작성일: {data.writeday}</p>
        <p className="magazine-detail-title2">{data.title2}</p>
        <p className="magazine-detail-ctext">
        	<ReactMarkdown 
	        	remarkPlugins={[remarkGfm]} 
	        	rehypePlugins={[rehypeRaw]}
	        	components={{
				    p: ({ node, ...props }) => <p className="magazine-detail-text" {...props} />,
				    img: ({ node, ...props }) => <img className="magazine-detail-image" {...props} />
				}}
	        >
	        	{data.content}
        	</ReactMarkdown>
        </p>
        <div className="magazine-detail-footer">
          <div className="magazine-detail-admin">에디터 : {data.admin_name}
            <a className = 'hidden'>{data.admin_id}</a></div>
          <div className="magazine-detail-stats">
            <span className="magazine-detail-likes">
	            <Favorite
                    color={data.liked ? 'error' : 'action'}
                    onClick={handleLikeClick}
                />
              {data.like}
          	</span>
            <p>
              <Bookmark
                  color={isScrapped ? 'primary' : 'action'}
                  onClick={onScrapHandler}
                  style={{cursor: 'pointer'}}
              />
            </p>
            <span className="magazine-detail-views"><Visibility/>{data.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineDetail;
