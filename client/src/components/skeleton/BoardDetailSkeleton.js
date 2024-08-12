import './boardDetailSkeleton.css';

const BoardDetailSkeleton = () => (
    <div className="skeleton-detail-container">
        <div className="skeleton-detail-post">
            <div className="skeleton-detail-info">
                <div className="skeleton-detail-avatar-container"></div>
                <div className="skeleton-detail-nick-container"></div>
            </div>
            <div className="skeleton-detail-title-container"></div>
            <div className="skeleton-detail-content-container"></div>
            <div className="skeleton-detail-icon-container"></div>
        </div>
    </div>
);

export default BoardDetailSkeleton;