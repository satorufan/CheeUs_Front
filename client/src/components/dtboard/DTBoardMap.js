import React, { useEffect, useState } from 'react';
import { usePosts } from './PostContext'; // usePosts 훅을 임포트
import { useNavigate } from 'react-router-dom';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { selectUserProfile } from '../../store/ProfileSlice';
import { useSelector } from 'react-redux';

/* global kakao */
const kakaokey = "cc91cb103ac5f5d244562ea0a92a3053"; // 카카오 API 키

const DTBoardMap = ({ selectedPostId }) => {
  const [map, setMap] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [markers, setMarkers] = useState([]);
  const { posts } = usePosts(); // usePosts 훅을 사용하여 posts 데이터를 가져옴
  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  
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
		  
		  if(navigator.geolocation){
			  navigator.geolocation.getCurrentPosition((position)=>{
				  const latitude = position.coords.latitude;
				  const longitude = position.coords.longitude;
				  map.setCenter(new kakao.maps.LatLng(latitude, longitude));
			  });
		  }

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
            if (post.latitude && post.longitude) {
              const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(post.latitude, post.longitude),
              });

              // 마커에 클릭 이벤트 추가 (예: 커스텀 오버레이 표시)
              const overlay = new kakao.maps.CustomOverlay({
                content: generateCustomOverlayContent(post, () => overlay.setMap(null)),
                position: marker.getPosition(),
                yAnchor: 1.37,
                zIndex: 3,
                clickable: true
              });

              kakao.maps.event.addListener(marker, 'click', () => {
                overlay.setMap(map);
              });

              return { marker, overlay, post };
            }
            return null;
          }).filter(markerObj => markerObj !== null);

          // 클러스터러에 마커들을 추가
          clusterer.addMarkers(newMarkers.map(markerObj => markerObj.marker));

          setMarkers(newMarkers);
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [posts]);

  useEffect(() => {
    if (selectedPostId && markers.length > 0) {
      const selectedMarkerObj = markers.find(markerObj => markerObj.post.id === selectedPostId);
      if (selectedMarkerObj) {
        selectedMarkerObj.overlay.setMap(map);
        map.panTo(new kakao.maps.LatLng(selectedMarkerObj.post.latitude, selectedMarkerObj.post.longitude));
      }
    }
  }, [selectedPostId, markers]);

const handlePostClick = (id) => {
  const dtPostData = posts.find(post => post.id === parseInt(id, 10)); // id를 정수로 변환
  if (dtPostData) {
    navigate(`/dtboard/post/${id}`, { state: { dtPostData } });
  } else {
    console.error("해당 ID를 가진 게시물을 찾을 수 없습니다.");
  }
};
  
console.log("포스트",posts);

  const handleSearch = () => {
    if (!map || searchInput === '') return;

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchInput, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        data.forEach(place => {
		  map.setCenter(new kakao.maps.LatLng(place.y, place.x));
          bounds.extend(new kakao.maps.LatLng(place.y, place.x));
        });
        map.setBounds(bounds);
      }
    });
  };

  const generateCustomOverlayContent = (post, onClose) => {
    const relatedPosts = posts.filter(p => p.latitude === post.latitude && p.longitude === post.longitude);

    let content = `
      <div style="position: relative; display: inline-block; padding:15px; background-color:white; border-radius:10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.5); border: none;">
        <button style="position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 10px; cursor: pointer; color : black;">✖</button>
    `;

    relatedPosts.forEach(p => {
      content += `
        <h3 style="margin:0; padding-bottom:5px; border-bottom:1px solid #ccc;width: auto;">${p.title}</h3>
        <p style="margin:5px 0;">${p.location}</p>
        <button data-id="${p.id}" style="padding: 5px 10px; background-color: black; color: white; border: none; border-radius: 3px; cursor: pointer; width: 150px;">
          같이 마시러 가기
        </button>
        <br>
        <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid white;"></div>
      `;
    });

    content += `</div>`;

    // DOM element 생성 후 이벤트 리스너 추가
    const div = document.createElement('div');
    div.innerHTML = content.trim();
    const button = div.querySelector('button');
    button.addEventListener('click', onClose);
 
    return div;
  };

  useEffect(() => {
    const handleButtonClick = (event) => {
      const button = event.target;
      if (button.tagName === 'BUTTON' && button.dataset.id) {
        handlePostClick(button.dataset.id);
      }
    };

    document.addEventListener('click', handleButtonClick);

    return () => {
      document.removeEventListener('click', handleButtonClick);
    };
  }, []);


  const setUserLocation = () => {
    if (map && userProfile.profile.latitude && userProfile.profile.longitude) {
      const userLocation = new kakao.maps.LatLng(userProfile.profile.latitude, userProfile.profile.longitude);
      map.setCenter(userLocation);
    } else {
      console.error("사용자 위치 정보가 없습니다.");
    }
  };
	
  return (
    <>
      <div className="map-search-box">
        <input 
          type="text" 
          placeholder="검색어를 입력하세요" 
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value)} 
        />
        <button onClick={handleSearch}>검색</button>
        <MyLocationIcon 
        	onClick={setUserLocation}  color='action' />
      </div>
      <div id="map" style={{  height: '100%'}}></div>
    </>
  );
};

export default DTBoardMap;
