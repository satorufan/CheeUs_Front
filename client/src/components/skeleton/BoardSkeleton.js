import Card from '@mui/joy/Card';
import './boardSkeleton.css';

const BoardSkeleton = () => (
        <div className="skeleton-freeboard-card-container">
            {Array.from(new Array(4)).map((_, index) => (
            <Card key={index}>
                <div className="skeleton-card-video"></div>
                <div className="skeleton-card-avatar" />
            </Card>
            ))}
      </div>
);

export default BoardSkeleton;