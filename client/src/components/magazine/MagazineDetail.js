import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MagazineDetail.css';
import MagazineTop from './MagazineTop';
import { useMagazines } from './MagazineContext';

const MagazineDetail = () => {
  const { category, id } = useParams();
  const { magazines } = useMagazines();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (magazines && magazines[category]) {
      const magazineData = magazines[category][id];
      setData(magazineData);
    }
  }, [category, id, magazines]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="magazine-detail-container">
      <MagazineTop/>
      <div className="magazine-detail-content">
        <h2 className="magazine-detail-title">{data.title}</h2>
        <p className="magazine-detail-date">작성일: {data.date}</p>
        <p className="magazine-detail-text">{data.title2}</p>
      	<img src={data.photoes} alt={data.title} className="magazine-detail-image" />
        <p className="magazine-detail-text">{data.content}</p>
        <div className="magazine-detail-footer">
          <div className="magazine-detail-admin">에디터 : {data.admin_name}<a className = 'hidden'>{data.admin_id}</a></div>
          <div className="magazine-detail-stats">
            <span className="magazine-detail-likes">Likes: {data.like}</span>
            <span className="magazine-detail-views">Views: {data.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineDetail;
