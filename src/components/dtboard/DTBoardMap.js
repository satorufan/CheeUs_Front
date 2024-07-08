import React, { useEffect, useState } from 'react';

/* global kakao */
const kakaokey = "cc91cb103ac5f5d244562ea0a92a3053";
const DTBoardMap = () => {
  const [map, setMap] = useState(null);
  const [searchInput, setSearchInput] = useState('');
	
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaokey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new kakao.maps.LatLng(37.5665, 126.9780), // 지도의 중심 좌표
          level: 3, // 지도의 확대 레벨
        };
        const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다.
        setMap(map);
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSearch = () => {
    if (!map || searchInput === '') return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchInput, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        data.forEach(place => {
          bounds.extend(new kakao.maps.LatLng(place.y, place.x));
        });
        map.setBounds(bounds);
      }
    });
  };

  return (
    <div className="board-right">
      <div className="map-search-box">
        <input 
          type="text" 
          placeholder="검색어를 입력하세요" 
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value)} 
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      <div id="map" className="map"></div>
    </div>
  );
};

export default DTBoardMap;
