import React, { useEffect, useState } from 'react';

/* global kakao */
const kakaokey = "cc91cb103ac5f5d244562ea0a92a3053"; // 카카오 API 키

const PostDetailMap = ({ latitude, longitude, title, location }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaokey}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      try {
        if (window.kakao && window.kakao.maps) {
          kakao.maps.load(() => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
              center: new kakao.maps.LatLng(latitude, longitude),
              level: 3,
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);
            setMap(map);

            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(latitude, longitude),
              map: map,
            });

              // 마커에 클릭 이벤트 추가 (예: 커스텀 오버레이 표시)
              const overlay = new kakao.maps.CustomOverlay({
                content: generateCustomOverlayContent(),
                position: marker.getPosition(),
                yAnchor: 1.5,
                zIndex: 3,
                clickable: true
              });

                overlay.setMap(map);
          });
        }
      } catch (error) {
        console.error('카카오맵 스크립트 로드 중 오류 발생:', error);
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [latitude, longitude, title, location]);

  const generateCustomOverlayContent = ( ) => {

    let content = `
      <div style="position: relative; display: inline-block; padding:15px; background-color:white; border-radius:10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.5); border: none;">
        <h3 style="margin:0; padding-bottom:5px; border-bottom:1px solid #ccc;width: auto;">${title}</h3>
        <p style="margin:5px 0;">${location}</p>
        <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid white;"></div>
        </div>
      `;

    return content;
  };


  return (
    <div id="map" style={{  height: '100%', width: '100%'}}></div>
  );
};

export default PostDetailMap;
