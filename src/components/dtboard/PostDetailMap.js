import React, { useEffect, useState } from 'react';

/* global kakao */
const kakaokey = "cc91cb103ac5f5d244562ea0a92a3053"; // 카카오 API 키

const PostDetailMap = ({ lat, lng, title, description }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaokey}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      try {
        if (window.kakao && window.kakao.maps) {
          kakao.maps.load(() => {
            const mapContainer = document.getElementById('map');
            const mapOption = {
              center: new kakao.maps.LatLng(lat, lng),
              level: 3,
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);
            setMap(map);

            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(lat, lng),
              map: map,
            });

            const mapTypeControl = new kakao.maps.MapTypeControl();
            map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
            const zoomControl = new kakao.maps.ZoomControl();
            map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

            const content = `<div class = 'infowindow'><${title}><br/>장소 : ${description}</div>`;
            const infowindow = new kakao.maps.InfoWindow({
              content: content,
            });
            infowindow.open(map, marker);
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
  }, [lat, lng, title, description]);

  return (
    <div id="map" style={{  height: '87.5vh'}}></div>
  );
};

export default PostDetailMap;
