import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetail.css';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import EventTop from './EventTop';
import { useEvents } from './EventContext';
import { AuthContext } from '../login/OAuth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/firebase'; // Firebase 저장소 가져오기
import Swal from 'sweetalert2';
import { usePosts } from '../dtboard/PostContext';
import { Bookmark } from '@mui/icons-material';
import Spinner from 'react-bootstrap/Spinner';
import axios from "axios";

const EventDetail = () => {
  const { id } = useParams();
  const { events, toggleLike } = useEvents();
  const { serverUrl, token, memberEmail } = useContext(AuthContext);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [data, setData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isScrapped, setIsScrapped] = useState(false);
  const { addScrap, checkScrap } = usePosts();
  const [viewIncremented, setViewIncremented] = useState(false);
  
  useEffect(() => {
    if (events && events.event) {
      const eventData = Object.values(events.event).find(event => event.id.toString() === id);
      setData(eventData);
      setLiked(eventData?.liked); // 초기 liked 상태 설정
      setLikeCount(eventData?.like); // 초기 like 카운트 설정
    }
  }, [id, events]);

  // 조회수
  useEffect(() => {
    const incrementViewCount = async () => {
      if (viewIncremented) return; // 이미 증가했다면 요청 보내지 않음

      try {
        const response = await axios.put(
            `${serverUrl}/Event/incrementView/${id}`,
            {},
            {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
              withCredentials: true,
            }
        );

        if (response.data.success) {
          setData(prevData => ({
            ...prevData,
            views: response.data.updatedViewCount
          }));
          setViewIncremented(true); // 증가 완료 표시
        }
      } catch (error) {
        console.error('Error incrementing view count:', error.response?.status, error.response?.data, error.message);
      }
    };

    if (id && serverUrl && token) {
      incrementViewCount();
    }
  }, [id, serverUrl, token, viewIncremented]);

  const handleLikeClick = async () => {
    if (!memberEmail) {
      Swal.fire('로그인 후 이용가능합니다');
      return;
    }

    if (data) {
      try {
        const result = await toggleLike(serverUrl, data.id, token, memberEmail);
        setLiked(result.isLiked);
        setLikeCount(result.updatedLikeCount);
      } catch (error) {
        console.error('좋아요 토글 에러:', error.response?.status, error.response?.data, error.message);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
          try {
              // Check if post is scrapped
              const isPostScrapped = await checkScrap(serverUrl, memberEmail, data.id, token, 3);
              setIsScrapped(isPostScrapped);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
        }
    };
    fetchData();
  }, [data, serverUrl, memberEmail, token]);

  const onScrapHandler = async () => {
    if (!memberEmail) {
      Swal.fire('로그인 후 이용가능합니다');
      return;
    }
    
    const scrapMessage = await addScrap(serverUrl, memberEmail, id, data.title, token, window.location.href, 3 );
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
    <div className="event-detail-container">
      <EventTop />
      <div className="event-detail-content">
        <h2 className="event-detail-title">{data.title}</h2>
        <p className="event-detail-date">작성일: {data.writeday}</p>
        <p className="event-detail-title2">{data.title2}</p>
        <p className="event-detail-ctext">
        	<ReactMarkdown 
	        	remarkPlugins={[remarkGfm]} 
	        	rehypePlugins={[rehypeRaw]}
	        	components={{
				    p: ({ node, ...props }) => <p className="event-detail-text" {...props} />,
				    img: ({ node, ...props }) => <img className="event-detail-image" {...props} />
				}}
	        >
	        	{data.content}
        	</ReactMarkdown>
        </p>
        <div className="event-detail-footer">
          <div className="event-detail-admin">에디터 : {data.admin_name}</div>
          <a className="hidden">{data.admin_id}</a>
          <div className="event-detail-stats">
            <span className="event-detail-likes">
	            <Favorite
	          	  color={liked ? 'error' : 'action'}
	          	  onClick={handleLikeClick}
	          	/>
	          	{likeCount}
          	</span>
            <p>
              <Bookmark 
                color={isScrapped ? 'primary' : 'action'} 
                onClick={onScrapHandler}
                style={{ cursor: 'pointer' }}
              /> 
            </p>
            <span className="event-detail-views"><Visibility/>{data.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
