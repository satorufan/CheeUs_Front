import React, { useEffect, useState } from 'react';

/* global kakao */
const kakaokey = "cc91cb103ac5f5d244562ea0a92a3053";
const DTBoardMap = () => {
  const [map, setMap] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [markers, setMarkers] = useState([]);

// api지도 삽입 ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaokey}&autoload=false`; // !!!설정 좀더 찾아봐야할듯
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const mapOption = {
            center: new kakao.maps.LatLng(37.5665, 126.9780), // 지도 중심 좌표
            level: 3, // 지도 확대 레벨
          };
          const map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성
          setMap(map);

// 여기까지 api 지도 삽입 기능 -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// 지도 마커 설정 ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          kakao.maps.event.addListener(map, 'click', (mouseEvent) => { // 지도클릭
            const latlng = mouseEvent.latLng;
            const newMarker = new kakao.maps.Marker({
              position: latlng,
            });

            newMarker.setMap(map); // 마커를 지도에 표시

            // 마커에 고유 ID 부여
            const newMarkerWithId = {
              id: Date.now(), // 현재 시간(ms)를 ID로 사용
              marker: newMarker,
            };

            setMarkers(prevMarkers => {
              // 이전 마커들을 제거
              prevMarkers.forEach(markerObj => markerObj.marker.setMap(null));
              // 새 마커 추가
              return [newMarkerWithId];
            });
          });
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
// 여기까지 지도 마커 기능 -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// 지도 검색 기능 (미완) -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
