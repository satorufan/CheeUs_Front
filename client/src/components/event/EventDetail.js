import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetail.css';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import EventTop from './EventTop';
import { useEvents } from './EventContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/firebase'; // Firebase 저장소 가져오기

const EventDetail = () => {
  const { id } = useParams();
  const { events } = useEvents();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (events && events.event) {
      const eventData = Object.values(events.event).find(event => event.id.toString() === id);
      setData(eventData);
    }
  }, [id, events]);

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
            <span className="event-detail-likes"><Favorite/>{data.like}</span>
            <span className="event-detail-views"><Visibility/>{data.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
