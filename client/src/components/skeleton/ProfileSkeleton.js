import React from 'react';
import './profileSkeleton.css'; 

const ProfileSkeleton = () => {
    return (
        <div className="profile-card skeleton">
            <div className="skeleton profile-image"></div>
            <div className="profile-details">
                <div className="skeleton h3"></div>
                <div className="location-like">
                    <div className="skeleton location"></div>
                </div>
                <div className="profileIntro-tag">
                    <div className="skeleton intro"></div>
                </div>
            </div>
            <div className="skeleton-tag"></div>
        </div>
    );
};

export default ProfileSkeleton;