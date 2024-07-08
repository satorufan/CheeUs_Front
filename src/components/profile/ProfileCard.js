import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel, Modal } from 'react-bootstrap';
import './profileCard.css'

const ProfileCard = ({ profile, photos, loggedInUserId }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

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

    const handleImageClick = (index) => {
        setModalIndex(index);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    let photosToShow = [];
    if (Array.isArray(photos) && photos.length > 0) {
        photosToShow = photos.map(photoId => `https://placehold.it/200x200?text=${photoId}`);
    } else if (typeof photos === 'number') {
        photosToShow = [`https://placehold.it/200x200?text=${photos}`];
    } else {
        // Handle case where photos is undefined or not an array
        photosToShow = [`https://placehold.it/200x200?text=No Photos`];
    }

    let distanceToDisplay = '거리 알 수 없음';

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
                        <li>👍{profile.popularity}</li>
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