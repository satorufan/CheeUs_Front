import React, { useEffect, useState } from 'react';

/* global kakao */
const kakaokey = "cc91cb103ac5f5d244562ea0a92a3053";
const DTBoardMap = () => {
  const [map, setMap] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [markers, setMarkers] = useState([]);
  const posts = [
    { id: 1, title: '호수공원 벤치에서 맥주드실분', description: 'Menu description.', lat: 37.5665, lng: 126.9780 },
    { id: 2, title: '다운타운에서 맥주 같이드실분', description: 'Menu description.', lat: 37.5700, lng: 126.9760 },
    { id: 3, title: '피맥 조지실분 선착순 3명 구합니다', description: '피자네버슬립스-잠실점 | 2024.07.03 6:30pm', lat: 37.5710, lng: 126.9766  },
    { id: 4, title: '곱소하실분 - 나루역 4출 4명', description: 'Menu description.', lat: 37.5730, lng: 126.9770 },
    { id: 5, title: '참치 배터지게 드실분있나요?', description: 'Menu description.', lat: 37.5700, lng: 126.9760  },
    { id: 6, title: 'dumi 1', description: 'dumi1'},
    { id: 7, title: 'dumi 2', description: 'dumi2'},
    { id: 8, title: 'dumi 3', description: 'dumi3'},
    { id: 9, title: 'dumi 4', description: 'dumi4'},
    { id: 10, title: 'dumi 5', description: 'dumi5'},
    { id: 12, title: 'dumi 6', description: 'dumi6'},
    { id: 13, title: 'dumi 7', description: 'dumi7'},
    { id: 14, title: 'dumi 8', description: 'dumi8'},
    { id: 15, title: 'dumi 9', description: 'dumi9'},
    { id: 16, title: 'dumi 10', description: 'dumi10'},
    { id: 17, title: 'dumi 11', description: 'dumi11'},
    { id: 18, title: 'dumi 12', description: 'dumi12'},
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaokey}&libraries=services,clusterer&autoload=false`; // clusterer 라이브러리 추가
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

          // 지도 컨트롤러 기능 추가
          const mapTypeControl = new kakao.maps.MapTypeControl();
          map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
          const zoomControl = new kakao.maps.ZoomControl();
          map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

          // 마커 클러스터러를 생성
          const clusterer = new kakao.maps.MarkerClusterer({
            map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
            averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
            minLevel: 10 // 클러스터 할 최소 지도 레벨
          });

          // 게시물 위치에 마커 추가
          const newMarkers = posts.map(post => {
            if (post.lat && post.lng) {
              const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(post.lat, post.lng),
              });

              // 마커에 클릭 이벤트 추가 (예: 인포윈도우 표시)
              const infowindow = new kakao.maps.InfoWindow({
                content: `<div style="padding:5px;">${post.title}</div>`, // 게시물 제목을 표시
              });
              kakao.maps.event.addListener(marker, 'click', () => {
                infowindow.open(map, marker);
              });

              return marker;
            }
            return null;
          }).filter(marker => marker !== null);

          // 클러스터러에 마커들을 추가
          clusterer.addMarkers(newMarkers);

          // 클릭 이벤트 설정
          kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
            const latlng = mouseEvent.latLng;
            const geocoder = new kakao.maps.services.Geocoder();

            geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name;
                const message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고 경도는 ' + latlng.getLng() + '입니다.'; // 주소 정보
                console.log(message);

                const newMarker = new kakao.maps.Marker({
                  position: latlng,
                });

                newMarker.setMap(map); // 마커를 지도에 표시

                // 인포윈도우 내용
                const iwContent = `
                  <div style="padding:5px;">
                    ${address} <br>
                    <a href="https://map.kakao.com/link/map/${address},${latlng.getLat()},${latlng.getLng()}" style="color:blue" target="_blank">큰지도보기</a> 
                    <a href="https://map.kakao.com/link/to/${address},${latlng.getLat()},${latlng.getLng()}" style="color:blue" target="_blank">길찾기</a>
                  </div>`;
                
                // 인포윈도우 생성
                const infowindow = new kakao.maps.InfoWindow({
                  content: iwContent,
                  position: latlng,
                });

                // 마커 위에 인포윈도우를 표시
                infowindow.open(map, newMarker);

                setMarkers(prevMarkers => {
                  // 이전 마커와 인포윈도우 제거
                  prevMarkers.forEach(markerObj => {
                    markerObj.marker.setMap(null);
                    markerObj.infowindow.close();
                  });
                  // 새 마커와 인포윈도우 추가
                  return [{ marker: newMarker, infowindow: infowindow }];
                });
              }
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

  const handleSearch = () => {
    if (!map || searchInput === '') return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchInput, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        data.forEach(place => {
          const newMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(place.y, place.x),
            map: map,
          });
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
