import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetail.css';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import EventTop from './EventTop';
import { useEvents } from './EventContext';
import { AuthContext } from '../login/OAuth';

const EventDetail = () => {
  const { id } = useParams();
  const { events, incrementViewCount, toggleLike } = useEvents();
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

  useEffect(() => {
    if (data) {
      incrementViewCount(serverUrl, data.id, token);
    }
  }, [data, serverUrl, token, incrementViewCount]);

  const handleLikeClick = async () => {
    if (data) {
      try {
        const response = await toggleLike(serverUrl, data.id, memberEmail, token); // memberEmail 포함
        
        // 서버 응답 후 상태 업데이트
        if (response.success) {
          setLiked(response.liked); // 서버에서 받아온 liked 상태로 설정
          setLikeCount(response.likeCount); // 서버에서 받아온 likeCount로 설정
        }
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
        <p className="event-detail-ctext">{data.content}</p>
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
