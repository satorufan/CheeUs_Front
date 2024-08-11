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

const EventDetail = () => {
  const { id } = useParams();
  const { events, toggleLike } = useEvents();
  const { serverUrl, token, memberEmail } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (events && events.event) {
      const eventData = Object.values(events.event).find(event => event.id.toString() === id);
      setData(eventData);
      setLiked(eventData?.liked || false); // 초기 liked 상태 설정
      setLikeCount(eventData?.like || 0); // 초기 like 카운트 설정
    }
  }, [id, events]);
  

  const handleLikeClick = async () => {
    if (data) {
      try {
        await toggleLike(serverUrl, data.id, token);
        setLiked(!liked); 
        setLikeCount(liked ? likeCount - 1 : likeCount + 1); // 좋아요 카운트 업데이트
      } catch (error) {
        console.error('좋아요 토글 에러:', error);
      }
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-detail-container">
      <EventTop />
      <div className="event-detail-content">
        <h2 className="event-detail-title">{data.title}</h2>
        <p className="event-detail-date">작성일: {data.writeday}</p>
        <p className="event-detail-text">{data.title2}</p>
        <img src={data.photoes} alt={data.title} className="event-detail-image" />
        <p className="event-detail-ctext">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{data.content}</ReactMarkdown>
        </p>
        <div className="event-detail-footer">
          <div className="event-detail-admin">에디터 : {data.admin_name}</div>
          <a className="hidden">{data.admin_id}</a>
          <div className="event-detail-stats">
          	
            <span className="event-detail-likes">
	            <Favorite
	          	  color={data.liked ? 'error' : 'action'} 
	          	  onClick={handleLikeClick}
	          	/>
	          	{data.like}
          	</span>
            <span className="event-detail-views"><Visibility/>{data.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
