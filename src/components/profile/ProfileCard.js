import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel, Modal } from 'react-bootstrap';
import { updateUserLocation, likeProfile, unlikeProfile } from '../../store/ProfileSlice';
import './profileCard.css';
import noimage from "../images/noimage.jpg";
import { AuthContext } from '../login/OAuth';

const ProfileCard = ({ profile = {}, loggedInUserId, showLikeButton }) => {
    const dispatch = useDispatch();
    const userLocation = useSelector((state) => state.profile.userLocation);
    const likedProfiles = useSelector((state) => state.profile.likedProfiles);

    const [showModal, setShowModal] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    //const [likes, setLikes] = useState(profile.popularity);
    const [liked, setLiked] = useState(false);
    const { serverUrl, memberEmail } = useContext(AuthContext);

    const isLiked = likedProfiles.includes(profile.id);

    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        dispatch(updateUserLocation(location));
                    },
                    (error) => {
                        console.error('위치 정보를 가져오는 데 실패했습니다:', error);
                    }
                );
            }
        };

        getUserLocation();
    }, [dispatch]);

    // 프로필 좋아요 상태 초기화
    useEffect(() => {
        const likedProfiles = JSON.parse(localStorage.getItem('likedProfiles')) || [];
        if (likedProfiles.includes(profile.id)) {
            setLiked(true);
        }
    }, [profile.id]);

    // 나이 계산
    const calculateAge = (birth) => {
        if (!birth) return '나이 알 수 없음';
        const birthDate = new Date(birth.slice(0, 4), birth.slice(4, 6) - 1, birth.slice(6, 8));
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    // 직선 거리 계산
    const calculateStraightDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);

        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance * 10) / 10;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    // 이미지 클릭 시 모달
    const handleImageClick = (index) => {
        setModalIndex(index);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // 좋아요 버튼
    const handleLike = () => {
        if (showLikeButton) {
            if (isLiked) {
                dispatch(unlikeProfile(profile.id));
            } else {
                dispatch(likeProfile(profile.id));
            }
        }
    };

    // 사진 배열 안전하게 초기화
    const photosToShow = profile.photos || [];
    //console.log(photosToShow);

    let distanceToDisplay = '거리 알 수 없음';

    // 사용자 위치가 있으면 거리 계산
    if (userLocation) {
        if (profile.id === loggedInUserId) {
            distanceToDisplay = '0 km';
        } else {
            distanceToDisplay = `${calculateStraightDistance(
                userLocation.latitude,
                userLocation.longitude,
                parseFloat(profile.latitude),
                parseFloat(profile.longitude)
            )} km`;
        }
    }

    return (
        <div className="profile-card">
            <Carousel>
                {photosToShow.length > 0 ? (
                    photosToShow.map((photo, index) => (
                        <Carousel.Item key={index}>
                            <img
                                src={photo}
                                alt={`${profile.nickname}의 프로필`}
                                className="profile-image"
                                onClick={() => handleImageClick(index)}
                            />
                        </Carousel.Item>
                    ))
                ) : (
                    <Carousel.Item>
                        <div className="no-photo">
                            사진이 등록되지 않은 사용자입니다.
                        </div>
                    </Carousel.Item>
                )}
            </Carousel>
            <div className="profile-details">
            <h3>{profile.nickname} <span>&nbsp;{calculateAge(profile.birth)}세</span></h3>
                <div className="location-like">
                    <div>{distanceToDisplay}</div>
                </div>
                <div className='profileIntro-tag'>
                    <div className="profileIntro">{profile.intro}</div>
                    <ul className="profile-tags">
                        {profile.tags ? profile.tags.split(',').map(tag => (
                            <li key={tag.trim()}>{tag.trim()}</li>
                        )) : ""}
                        <li className="like-btn" onClick={handleLike}>
                            {isLiked ? '❤️' : '🤍'} {/*profile.popularity*/ 100}
                        </li>
                    </ul>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Body>
                    <Carousel activeIndex={modalIndex} onSelect={(selectedIndex) => setModalIndex(selectedIndex)}>
                        {photosToShow.length > 0 ? photosToShow.map((photo, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    src={photo}
                                    alt={`확대된 ${profile.nickname}의 프로필`}
                                    className="d-block w-100"
                                />
                            </Carousel.Item>
                        )) : null}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProfileCard;
