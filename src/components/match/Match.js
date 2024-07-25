import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TinderCards from './TinderCards';
import { Modal, Button } from 'react-bootstrap';
import './match.css';
import {
  setUserLocation,
  setLocationDenied,
  setMatchServiceAgreement,
  selectProfiles,
  selectLocationOk,
  selectMatchServiceAgreed,
  fetchUserProfiles,
  updateLocationPermission,
  updateMatchServiceAgreement
} from '../../store/MatchSlice';
import { AuthContext } from '../login/OAuth';
import { selectUserProfile } from '../../store/ProfileSlice';

const loggedInUserId = 1;

const Match = () => {
  const dispatch = useDispatch();
  const { memberEmail, serverUrl } = useContext(AuthContext);
  const userProfile = useSelector(selectUserProfile);
  const profiles = useSelector(selectProfiles);
  const locationOk = useSelector(selectLocationOk);
  const matchServiceAgreed = useSelector(selectMatchServiceAgreed);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMatchServiceModal, setShowMatchServiceModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfiles({ serverUrl }));
  }, [dispatch, serverUrl]);

  useEffect(() => {
    if (profiles && memberEmail) {
      const user = profiles.find(profile => profile.profile.email === memberEmail);
      
      if (user) {
        if (user.profile.locationOk === 1) {
          requestGeoLocation();
        } else if (user.profile.locationOk === 0) {
          setShowLocationModal(true);
        } else {
          dispatch(setLocationDenied());
        }
      }
    }
  }, [profiles, memberEmail, dispatch]);

  const requestGeoLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('사용자의 현재 위치:', { latitude, longitude });
          dispatch(setUserLocation({ coords: { latitude, longitude } }));
          updateLocationPermissionOnServer();
          setShowMatchServiceModal(true);
        },
        error => {
          console.error('위치 정보 요청 에러:', error);
          dispatch(setLocationDenied());
        }
      );
    } else {
      console.log('Geolocation 사용 불가능');
      dispatch(setLocationDenied());
    }
  };

  const updateLocationPermissionOnServer = () => {
    dispatch(updateLocationPermission({ serverUrl, userId: loggedInUserId }));
  };

  const updateMatchServiceAgreementOnServer = () => {
    dispatch(updateMatchServiceAgreement({ serverUrl, userId: loggedInUserId }));
  };

  const handleConfirm = () => {
    setShowLocationModal(false);
    requestGeoLocation();
  };

  const handleCancel = () => {
    setShowLocationModal(false);
  };

  const handleMatchServiceConfirm = () => {
    dispatch(setMatchServiceAgreement(true));
    setShowMatchServiceModal(false);
    updateMatchServiceAgreementOnServer();
  };

  const handleMatchServiceCancel = () => {
    dispatch(setMatchServiceAgreement(false));
    setShowMatchServiceModal(false);
  };

  const handleHelp = () => {
    setShowHelpModal(true);
  };

  return (
    <div className="match_container">
      {userProfile ? (
        userProfile.profile.locationOk === null ? (
          <div className="permissionMessage">
            <p>위치 정보 확인 중...</p>
          </div>
        ) : locationOk && !matchServiceAgreed ? (
          <div className="permissionMessage">
            <p>1:1 매칭 서비스를 사용하려면 동의해주세요.</p>
            <Button variant="dark" onClick={() => setShowMatchServiceModal(true)}>
              동의하기
            </Button>
          </div>
        ) : locationOk && matchServiceAgreed ? (
          <TinderCards profiles={profiles} />
        ) : (
          <div className="permissionMessage">
            <p>매칭 서비스를 사용하려면 위치 정보 제공에 동의해야 합니다.</p>
            {userProfile.profile.locationOk === false && (
              <>
                <div>
                  현재 위치 정보가 <span>차단</span>되어 있습니다.
                </div>
                <div>
                  주소창 왼쪽의 <span>ⓘ</span> 버튼을 눌러 위치 권한을 <span>허용</span>한 후 다시 시도해주세요.
                </div>
              </>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="dark" onClick={() => setShowLocationModal(true)}>동의하기</Button>
              <Button variant="dark" onClick={handleHelp}>도움말</Button>
            </div>
          </div>
        )
      ) : (
        <div className="permissionMessage">
          <p>잠시만 기다려주세요...</p>
        </div>
      )}
  
      {/* 위치 정보 동의 모달 */}
      <Modal show={showLocationModal} onHide={() => setShowLocationModal(false)} style={{ fontFamily: "YeojuCeramic" }}>
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
      <Modal show={showMatchServiceModal} onHide={handleMatchServiceCancel} style={{ fontFamily: "YeojuCeramic" }}>
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
  
      {/* 도움말 모달 */}
      <Modal show={showHelpModal} onHide={() => setShowHelpModal(false)} style={{ fontFamily: "YeojuCeramic", fontSize: "12px" }}>
        <Modal.Header closeButton>
          <Modal.Title>위치 권한 활성화 방법</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>아래는 다양한 브라우저에서 위치 권한을 활성화하는 방법입니다:</p>
          <h5>Chrome (데스크톱):</h5>
          <ol>
            <li>오른쪽 상단의 더 보기(세 개의 점 아이콘)를 클릭하고 '설정'을 선택합니다.</li>
            <li>개인정보 및 보안을 클릭한 후, '사이트 설정' → '위치'를 찾아 'CheeUp'에 위치 접근 권한을 허용합니다.</li>
          </ol>
          <h5>Safari (데스크톱):</h5>
          <ol>
            <li>화면 상단의 Safari를 클릭하고 '설정' → '웹사이트'를 선택합니다.</li>
            <li>'위치'를 찾아 'CheeUp'를 선택하고 '허용하기'를 클릭합니다.</li>
          </ol>
          <h5>Safari (iOS):</h5>
          <ol>
            <li>iOS 설정에서 '개인정보 보호'를 선택합니다.</li>
            <li>'위치 서비스' → 'Safari'를 찾아 '앱을 사용하는 동안' 권한을 허용합니다.</li>
          </ol>
          <h5>Firefox (데스크톱):</h5>
          <ol>
            <li>CheeUp.com으로 이동한 후, 웹사이트 URL 옆의 정보 아이콘을 클릭합니다.</li>
            <li>'권한'에서 '위치'를 선택하고 필요한 권한을 설정합니다.</li>
          </ol>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="secondary" onClick={() => setShowHelpModal(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Match;
