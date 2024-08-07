import React from 'react';
import './chatListSkeleton.css';

const ChatListSkeleton = ({ isTogether }) => (
    <div className={`skeleton-container ${isTogether ? 'hide-avatar' : ''}`}>
        {Array.from(new Array(4)).map((_, index) => (
            <div key={index} className="skeleton-item">
                <div className="skeleton-top">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-title"></div>
                </div>
                <div>
                    <div className="skeleton-subtitle"></div>
                </div>
            </div>
        ))}
    </div>
);

export default ChatListSkeleton;
