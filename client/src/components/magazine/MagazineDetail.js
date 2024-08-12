import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MagazineDetail.css';
import Favorite from '@mui/icons-material/Favorite';
import Visibility from '@mui/icons-material/Visibility';
import MagazineTop from './MagazineTop';
import { useMagazines } from './MagazineContext';
import Spinner from 'react-bootstrap/Spinner';

const MagazineDetail = () => {
  const { category, id } = useParams();
  const { magazines } = useMagazines();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (magazines && magazines.magazine) { // magazines 객체에 magazine 배열이 있는지 확인
      const magazineData = magazines.magazine.find(
          (magazine) => magazine.id.toString() === id && magazine.category === category
      ); // magazine 배열에서 id와 category가 일치하는 항목을 찾음
      setData(magazineData); // 찾은 데이터를 state에 설정
    }
  }, [category, id, magazines]);


  if (!data) {
    return (
      <div>로딩중...
        <div>
          <Spinner animation="border" variant="dark" />
        </div>
      </div>
    );
  }

  return (
    <div className="magazine-detail-container">
      <MagazineTop/>
      <div className="magazine-detail-content">
        <h2 className="magazine-detail-title">{data.title}</h2>
        <p className="magazine-detail-date">작성일: {data.writeday}</p>
        <p className="magazine-detail-text">{data.title2}</p>
      	<img src={data.photoes} alt={data.title} className="magazine-detail-image" />
        <p className="magazine-detail-text" dangerouslySetInnerHTML={{ __html: data.content }}></p>
        <div className="magazine-detail-footer">
          <div className="magazine-detail-admin">에디터 : {data.admin_name}<a className = 'hidden'>{data.admin_id}</a></div>
          <div className="magazine-detail-stats">
            <span className="magazine-detail-likes"><Favorite/>{data.like}</span>
            <span className="magazine-detail-views"><Visibility/>{data.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineDetail;
