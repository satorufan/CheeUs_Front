import React, { useEffect, useState } from 'react';
import TinderCards from './TinderCards';
import profiles from '../../profileData';
import { Modal, Button } from 'react-bootstrap';
import './match.css';
import axios from 'axios';

const loggedInUserId = 1;

const Match = () => {
  const [locationOk, setLocationOk] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [userLocation, setUserLocation] = useState(null); 
  const [matchServiceAgreed, setMatchServiceAgreed] = useState(false); 

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const user = profiles.find(profile => profile.id === loggedInUserId);
        if (user && user.location_ok === 1) {
          // 위치 동의가 이미 허용된 경우
          requestGeoLocation(setUserLocation, setLocationOk);
        } else if (user && user.location_ok === 0) {
          // 위치 동의는 했지만 GPS 요청을 거부한 경우
          setShowModal(true);
        } else {
          // 사용자 정보가 없는 경우
          setLocationOk(false);
        }
      } catch (error) {
        console.error('위치 정보 확인 중 에러 발생: ', error);
        setLocationOk(false);
      }
    };

    // 컴포넌트가 마운트될 때 위치 동의 확인
    if (locationOk === null) {
      checkLocationPermission();
    }
  }, [locationOk]);

  // 모달에서 동의 버튼 클릭
  const handleConfirm = () => {
    setShowModal(false); 
    setLocationOk(true); 
    requestGeoLocation(setUserLocation, setLocationOk); // GPS 요청
    updateLocationPermissionOnServer(); // 서버에 위치 정보 동의 업데이트 요청
  };

  // 모달에서 취소 버튼 클릭
  const handleCancel = () => {
    setLocationOk(false); 
    setShowModal(false);
  };

  // 1:1 매칭 서비스 동의 모달에서 동의 버튼 클릭 시 처리
  const handleMatchServiceConfirm = () => {
    setMatchServiceAgreed(true);
    updateMatchServiceAgreementOnServer(); // 서버에 매칭 서비스 동의 업데이트 요청
  };

  // 1:1 매칭 서비스 동의 모달에서 취소 버튼 클릭 시 처리
  const handleMatchServiceCancel = () => {
    setMatchServiceAgreed(false); // 1:1 매칭 서비스 동의 거부 상태로 변경
  };

  return (
    <div className="Match_container">
      {locationOk === null ? (
        <div className="permissionMessage">
          <p>위치 정보 확인 중...</p>
        </div>
      ) : locationOk && userLocation && !matchServiceAgreed ? (
        <div className="permissionMessage">
          <p>1:1 매칭 서비스를 사용하려면 동의해주세요.</p>
          <Button variant="dark" onClick={() => setShowModal(true)}>
            동의하기
          </Button>
        </div>
      ) : locationOk && userLocation && matchServiceAgreed ? (
        <TinderCards profiles={profiles} />
      ) : (
        <div className="permissionMessage">
          <p>매칭 서비스를 사용하려면 위치 정보 제공에 동의해야 합니다.</p>
          {locationOk === false && (
            <>
              <div>
                현재 위치 정보가 <span>차단</span>되어 있습니다.
              </div>
              <div>
                주소창 왼쪽의 <span>ⓘ</span> 버튼을 눌러 위치 권한을 <span>허용</span>한 후 다시 시도해주세요.
              </div>
            </>
          )}
          <Button variant="dark" onClick={() => setShowModal(true)}>
            동의하기
          </Button>
        </div>
      )}

      {/* 위치 정보 동의 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} style={{ fontFamily: "YeojuCeramic" }}>
        <Modal.Header closeButton>
          <Modal.Title>위치 정보 동의</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          이 앱이 사용자의 위치 정보를 사용하도록 허용하시겠습니까?
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="dark" onClick={handleConfirm}>
            동의
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 1:1 매칭 서비스 동의 모달 */}
      <Modal show={!matchServiceAgreed && locationOk && userLocation} onHide={handleMatchServiceCancel} style={{ fontFamily: "YeojuCeramic" }}>
        <Modal.Header closeButton>
          <Modal.Title>1:1 매칭 서비스 사용 동의</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          1:1 매칭 서비스를 사용하도록 허용하시겠습니까?
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="secondary" onClick={handleMatchServiceCancel}>
            취소
          </Button>
          <Button variant="dark" onClick={handleMatchServiceConfirm}>
            동의
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Match;

// 브라우저에서 GPS 동의 요청
const requestGeoLocation = (setUserLocation, setLocationOk) => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('사용자의 현재 위치:', position.coords);
        // 위치 정보를 상태에 저장
        setUserLocation(position.coords);
        setLocationOk(true);
      },
      error => {
        console.error('위치 정보 요청 에러:', error);
        setLocationOk(false); 
      }
    );
  } else {
    console.log('Geolocation 사용 불가능');
    setLocationOk(false); 
  }
};

// 서버에 위치 정보 동의 업데이트 요청
const updateLocationPermissionOnServer = async () => {
  try {
    const user = profiles.find(profile => profile.id === loggedInUserId);
    const updatedUser = { ...user, location_ok: 1 };
    console.log('서버에 위치 정보 동의 업데이트 요청:', updatedUser);

     // url 설정하기
    const response = await axios.put(`https://your-server-api-url/updateLocationPermission/${loggedInUserId}`, updatedUser);
    console.log('서버 응답:', response.data);
  } catch (error) {
    console.error('서버 요청 에러:', error);
  }
};

// 서버에 매칭 서비스 동의 업데이트 요청 
const updateMatchServiceAgreementOnServer = async () => {
  try {
    const user = profiles.find(profile => profile.id === loggedInUserId);
    const updatedUser = { ...user, match_ok: 1 }; 
    console.log('서버에 매칭 서비스 동의 업데이트 요청:', updatedUser);

    // url 설정하기
    const response = await axios.put(`https://your-server-api-url/updateMatchServiceAgreement/${loggedInUserId}`, updatedUser);
    console.log('서버 응답:', response.data); // 서버에서 받은 응답 로그
  } catch (error) {
    console.error('서버 요청 에러:', error);
  }
};