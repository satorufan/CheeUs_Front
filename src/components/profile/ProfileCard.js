import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel, Modal } from 'react-bootstrap';
import './profileCard.css';

const ProfileCard = ({ profile, photos, loggedInUserId, showLikeButton }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [likes, setLikes] = useState(profile.popularity);
    const [liked, setLiked] = useState(false); 

    // 사용자 위치 가져오기
    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                        axios.post('http://localhost:3000/api/user/location', {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        })
                        .then(response => {
                            console.log('위치 데이터 저장됨:', response.data);
                        })
                        .catch(error => {
                            console.error('위치 데이터 저장 중 오류 발생:', error);
                        });
                    },
                    error => {
                        console.error('사용자 위치 가져오기 오류:', error);
                    }
                );
            } else {
                console.error('Geolocation이 지원되지 않습니다');
            }
        };

        getUserLocation();
    }, []);

    // 프로필 좋아요 상태 초기화
    useEffect(() => {
        const likedProfiles = JSON.parse(localStorage.getItem('likedProfiles')) || [];
        if (likedProfiles.includes(profile.id)) {
            setLiked(true);
        }
    }, [profile.id]);

    // 나이 계산
    const calculateAge = (birth) => {
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
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
            if (liked) {
                // Unlike the profile
                setLikes(likes - 1);
                setLiked(false); // Mark profile as unliked
                // Remove profile from likedProfiles in localStorage
                const likedProfiles = JSON.parse(localStorage.getItem('likedProfiles')) || [];
                const updatedLikedProfiles = likedProfiles.filter(id => id !== profile.id);
                localStorage.setItem('likedProfiles', JSON.stringify(updatedLikedProfiles));

                axios.delete(`http://localhost:3000/api/user/${profile.id}/like`)
                    .then(response => {
                        console.log('좋아요가 취소되었습니다:', response.data);
                    })
                    .catch(error => {
                        console.error('좋아요 취소 중 오류 발생:', error);
                    });
            } else {
                // Like the profile
                setLikes(likes + 1);
                setLiked(true); // Mark profile as liked
                // Update likedProfiles in localStorage
                const likedProfiles = JSON.parse(localStorage.getItem('likedProfiles')) || [];
                localStorage.setItem('likedProfiles', JSON.stringify([...likedProfiles, profile.id]));

                axios.post(`http://localhost:3000/api/user/${profile.id}/like`, { likes: likes + 1 })
                    .then(response => {
                        console.log('좋아요가 업데이트되었습니다:', response.data);
                    })
                    .catch(error => {
                        console.error('좋아요 업데이트 중 오류 발생:', error);
                    });
            }
        }
    };

    // 사진 배열
    let photosToShow = [];
    if (Array.isArray(photos) && photos.length > 0) {
        photosToShow = photos.map(photoId => `https://placehold.it/200x200?text=${photoId}`);
    } else if (typeof photos === 'number') {
        photosToShow = [`https://placehold.it/200x200?text=${photos}`];
    } else {
        photosToShow = [`https://placehold.it/200x200?text=No Photos`];
    }

    let distanceToDisplay = '거리 알 수 없음';

    // 사용자 위치가 있으면 거리 계산
    if (userLocation) {
        if (profile.id === loggedInUserId) {
            distanceToDisplay = '0 km';
        } else {
            distanceToDisplay = `${calculateStraightDistance(userLocation.latitude, userLocation.longitude, profile.latitude, profile.longitude)} km`;
        }
    }

    return (
        <div className="profile-card">
            <Carousel>
                {photosToShow.map((photo, index) => (
                    <Carousel.Item key={index}>
                        <img
                            src={photo}
                            alt={`${profile.nickname}의 프로필`}
                            className="profile-image"
                            onClick={() => handleImageClick(index)}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
            <div className="profile-details">
                <h3>{profile.nickname} <span>&nbsp;{calculateAge(profile.birth)}세</span></h3>
                <div className="location-like">
                    <div>{distanceToDisplay}</div>
                </div>
                <div className='profileIntro-tag'>
                    <div className="profileIntro">{profile.intro}</div>
                    <ul className="profile-tags">
                        {profile.tags.split(',').map(tag => (
                            <li key={tag.trim()}>{tag.trim()}</li>
                        ))}
                        <li className="like-btn" onClick={handleLike}>
                                {liked ? '❤️' : '🤍'} {likes}
                        </li>
                    </ul>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Body>
                    <Carousel activeIndex={modalIndex} onSelect={(selectedIndex) => setModalIndex(selectedIndex)}>
                        {photosToShow.map((photo, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    src={photo}
                                    alt={`확대된 ${profile.nickname}의 프로필`}
                                    className="d-block w-100"
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProfileCard;