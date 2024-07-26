import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetail.css';
import EventTop from './EventTop';

const dummyData = {
  event: {
    1: {
      id: 6,
      title: "CHEE US 6월 이벤트!",
      content: "6월의 이벤트!",
      photoes: "/images/event6.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-06-01",
    },
    2: {
      id: 7,
      title: "CHEE US 7월 이벤트!",
      content: "7월의 이벤트!",
      photoes: "/images/event7.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-07-01",
    },
    3: {
      id: 8,
      title: "CHEE US 8월 이벤트!",
      content: "8월의 이벤트!",
      photoes: "/images/event8.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-08-01",
    },
    4: {
      id: 9,
      title: "CHEE US 9월 이벤트!",
      content: "9월의 이벤트!",
      photoes: "/images/event9.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-09-01",
    },
    5: {
      id: 10,
      title: "CHEE US 10월 이벤트!",
      content: "10월의 이벤트!",
      photoes: "/images/event10.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-10-01",
    },
    6: {
      id: 11,
      title: "CHEE US 11월 이벤트!",
      content: "11월의 이벤트!",
      photoes: "/images/event11.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-11-01",
    },
    7: {
      id: 12,
      title: "CHEE US 12월 이벤트!",
      content: "12월의 이벤트!",
      photoes: "/images/event12.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-12-01",
    },
  },
};

const EventDetail = () => {
  const { category, id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // 선택된 카테고리와 id를 기반으로 데이터 설정
    setData(dummyData[category][id]);
  }, [category, id]);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="event-detail-container">
      <EventTop/>
      <div className="event-detail-content">
        <h2 className="event-detail-title">{data.title}</h2>
        <p className="event-detail-date">작성일: {data.date}</p>
        <p className="event-detail-text">{data.content}</p>
      	<img src={data.photoes} alt={data.title} className="event-detail-image" />
        <div className="event-detail-footer">
          <div className="event-detail-author">에디터 : {data.author_name}</div>
          <a className = "hidden">{data.admin_id}</a>
          <div className="event-detail-stats">
            <span className="event-detail-likes">Likes: {data.like}</span>
            <span className="event-detail-views">Views: {data.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
