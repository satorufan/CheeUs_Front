import React, { useEffect, useState } from 'react';
/* global kakao */
const kakaokey = "cc91cb103ac5f5d244562ea0a92a3053"; // 카카오 API 키

// 게시물 데이터
const posts = [
  { id: 1, title: '호수공원 벤치에서 맥주드실분', description: 'Menu description.', lat: 37.5665, lng: 126.9780 },
  { id: 2, title: '다운타운에서 맥주 같이드실분', description: 'Menu description.', lat: 37.5700, lng: 126.9770 },
  { id: 3, title: '피맥 조지실분 선착순 3명 구합니다', description: '피자네버슬립스-잠실점 | 2024.07.03 6:30pm', lat: 37.5700, lng: 126.9760 },
  { id: 4, title: '곱소하실분 - 나루역 4출 4명', description: 'Menu description.', lat: 37.5730, lng: 126.9770 },
];

const DTBoardMap = () => {
  const [map, setMap] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [markers, setMarkers] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // 카카오맵 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaokey}&libraries=services,clusterer&autoload=false`; // clusterer 라이브러리 추가
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        kakao.maps.load(() => {
          const mapContainer = document.getElementById('map'); // 지도를 표시할 div
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
            averageCenter: false, // 클러스터의 중심을 평균 위치가 아닌 클릭한 위치로 설정
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
                content: generateInfoWindowContent(post),
                removable: true
              });
              kakao.maps.event.addListener(marker, 'click', () => {
                infowindow.open(map, marker);
              });

              return { marker, infowindow, post };
            }
            return null;
          }).filter(markerObj => markerObj !== null);

          // 클러스터러에 마커들을 추가
          clusterer.addMarkers(newMarkers.map(markerObj => markerObj.marker));
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const generateInfoWindowContent = (post) => {
    const relatedPosts = posts.filter(p => p.lat === post.lat && p.lng === post.lng);

    let content = `
      <div style="padding:10px; background-color:white; border-radius:5px; box-shadow: 0px 0px 10px rgba(0,0,0,0.5);">
    `;

    relatedPosts.forEach(p => {
      content += `
        <h3 style="margin:0; padding-bottom:5px; border-bottom:1px solid #ccc;">${p.title}</h3>
        <p style="margin:5px 0;">${p.description}</p>
        <button style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">
          같이 마시러 가기
        </button>
        <br>
      `;
    });

    content += `</div>`;
    return content;
  };

  const handleSearch = () => {
    if (!map || searchInput === '') return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchInput, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data);
        setPagination(pagination);
        displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
      }
    });
  };

  const displayPlaces = (places) => {
    // 기존 마커 제거
    removeMarkers();

    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers = places.map((place, index) => {
      const placePosition = new kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(placePosition, index, place.place_name);
      bounds.extend(placePosition);

      return { marker, infowindow: marker.infowindow };
    });

    setMarkers(newMarkers);
    map.setBounds(bounds);
  };

  const addMarker = (position, idx, title) => {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
      imageSize = new kakao.maps.Size(36, 37),
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
        offset: new kakao.maps.Point(13, 37)
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position,
        image: markerImage
      });

    marker.setMap(map);

    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    kakao.maps.event.addListener(marker, 'mouseover', function () {
      displayInfowindow(marker, title);
    });

    kakao.maps.event.addListener(marker, 'mouseout', function () {
      infowindow.close();
    });

    return { marker, infowindow };
  };

  const displayInfowindow = (marker, title) => {
    const content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

    const infowindow = new kakao.maps.InfoWindow({
      content: content
    });

    infowindow.open(map, marker);
  };

  const removeMarkers = () => {
    markers.forEach(markerObj => {
      markerObj.marker.setMap(null);
    });
    setMarkers([]);
  };

  const displayPagination = () => {
    if (!pagination) return null;

    const fragment = [];
    for (let i = 1; i <= pagination.last; i++) {
      fragment.push(
        <a
          key={i}
          href="#"
          className={i === pagination.current ? 'on' : ''}
          onClick={(e) => {
            e.preventDefault();
            pagination.gotoPage(i);
          }}
        >
          {i}
        </a>
      );
    }

    return fragment;
  };

  return (
    <div className="board-right">
      <div className="map-search-box">
        <input
          type="text"
          id="keyword"
          placeholder="검색어를 입력하세요"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      <div id="map" className="map" ></div>
      <div className="search-result">
        <ul id="placesList">
          {places.map((place, index) => (
            <li key={index} className="item">
              <span className={`markerbg marker_${index + 1}`}></span>
              <div className="info">
                <h5>{place.place_name}</h5>
                {place.road_address_name ?
                  (<span>{place.road_address_name}<br /><span className="jibun gray">{place.address_name}</span></span>) :
                  (<span>{place.address_name}</span>)
                }
                <span className="tel">{place.phone}</span>
              </div>
            </li>
          ))}
        </ul>
        <div id="searchPagination">{displayPagination()}</div>
      </div>
    </div>
  );
};

export default DTBoardMap;
