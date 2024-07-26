import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MagazineDetail.css';
import MagazineTop from './MagazineTop';

const dummyData = {
  popup: {
    1: {
      id: 1,
      title: "이번주 가장핫한 성수 Label5 팝업!",
      content: "이번주 가장핫한 성수 Label5 팝업!",
      photoes: "/images/popup1.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-07-01",
    },
    2: {
	  id: 2,
      title: "Absolute 팝업",
      content: "보드카의 정석 Absolute 팝업",
      photoes: "/images/popup2.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 21,
      views: 78,
      date: "2023-07-02",
	},
	3: {
	  id: 3,
      title: "JackDaniel's pop-up",
      content: "JackDaniel's pop-up",
      photoes: "/images/popup3.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 5,
      views: 37,
      date: "2023-07-03",
	},
	4: {
	  id: 4,
      title: "Devine 보드카 성수 pop-up",
      content: "Devine 보드카 성수 pop-up",
      photoes: "/images/popup4.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 34,
      views: 97,
      date: "2023-07-04",
	},
	5: {
	   id: 5,
      title: "홍대 맥주시음 팝업",
      content: "홍대 맥주 시음 팝업",
      photoes: "/images/popup5.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 55,
      views: 138,
      date: "2023-07-05",
	},
  },
  recipe: {
    1: {
     id: 1,
      title: "스크류드라이버 레시피",
      content: "간결해서 만들기 쉬운!",
      photoes: "/images/recipe1.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-07-01",
    },
    2: {
	  id: 2,
      title: "쿠바 리브레 레시피",
      content: "실패할 수 없는 맛!",
      photoes: "/images/recipe2.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 21,
      views: 78,
      date: "2023-07-02",
	},
	3: {
	  id: 3,
      title: "데킬라 선라이즈 레시피",
      content: "사진잘받는 영롱한색!",
      photoes: "/images/recipe3.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 5,
      views: 37,
      date: "2023-07-03",
	},
	4: {
	   id: 4,
      title: "미도리사워 레시피",
      content: "모르는 사람은 있어도, 한잔만 마신 사람은 없다..!",
      photoes: "/images/recipe4.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 34,
      views: 97,
      date: "2023-07-04",
	},
	5: {
	  id: 5,
      title: "뉴욕 레시피",
      content: "라이위스키로 만드는 칵테일!",
      photoes: "/images/recipe5.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 55,
      views: 138,
      date: "2023-07-05",
	},
  },
  recommend: {
    1: {
      id: 1,
      title: "이주의 술집추천 : 성수동편",
      content: "성수의 핫한 술집 추천!",
      photoes: "/images/recommend1.jpg",
      admin_id: 1,
      author_name: "관리자",
      like: 17,
      views: 151,
      date: "2023-07-01",
    },
    2: {
	  id: 2,
      title: "이주의 술집추천 : 이태원편",
      content: "핫플 이태원의 술집추천",
      photoes: "/images/recommend2.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 21,
      views: 78,
      date: "2023-07-02",
	},
	3: {
	  id: 3,
      title: "이주의 술집추천 : 홍대편",
      content: "패피들의 성지 홍대 술집추천!",
      photoes: "/images/recommend3.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 5,
      views: 37,
      date: "2023-07-03",
	},
	4: {
	  id: 4,
      title: "이주의 술집추천 : 을지로편",
      content: "힙지로의 힙한 술집추천!",
      photoes: "/images/recommend4.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 34,
      views: 97,
      date: "2023-07-04",
	},
	5: {
	  id: 5,
      title: "이주의 술집추천 : 군자편",
      content: "나만 아는 군자 술집 추천!",
      photoes: "/images/recommend5.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 55,
      views: 138,
      date: "2023-07-05",
	},
  },
  tmi: {
    1: {
      id: 1,
	  title: "스크류드라이버를 아시나요?",
	  content: "광부들의 칵테일 스크류드라이버!",
	  photoes: "/images/tmi1.jpg",
	  admin_id: 1,
	  author_name: "관리자",
	  like: 17,
	  views: 151,
	  date: "2023-07-01",
    },
    2: {
      id: 2,
      title: "쿠바 리브레의 유래!",
      content: "쿠바의 자유를 기념하여!",
      photoes: "/images/tmi2.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 21,
      views: 78,
      date: "2023-07-02",
	},
	3: {
      id: 3,
      title: "데킬라 선라이즈에 대하여.",
      content: "일출을 떠오르게하는 색",
      photoes: "/images/tmi3.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 5,
      views: 37,
      date: "2023-07-03",
	},
	4: {
      id: 4,
      title: "초록빛 미도리 사워!",
      content: "달콤상콤한 초록빛 멜론 칵테일",
      photoes: "/images/tmi4.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 34,
      views: 97,
      date: "2023-07-04",
	},
	5: {
      id: 5,
      title: "뉴욕! TMI",
      content: "칵테일 NEW YORK",
      photoes: "/images/tmi5.jpg",
      admin_id: 2,
      author_name: "관리자",
      like: 55,
      views: 138,
      date: "2023-07-05",
	},
  },
};

const MagazineDetail = () => {
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
    <div className="magazine-detail-container">
      <MagazineTop/>
      <div className="magazine-detail-content">
        <h2 className="magazine-detail-title">{data.title}</h2>
        <p className="magazine-detail-date">작성일: {data.date}</p>
        <p className="magazine-detail-text">{data.content}</p>
      	<img src={data.photoes} alt={data.title} className="magazine-detail-image" />
        <div className="magazine-detail-footer">
          <div className="magazine-detail-author">에디터 : {data.author_name}<a className = 'hidden'>{data.admin_id}</a></div>
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
