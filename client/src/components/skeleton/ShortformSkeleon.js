import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Avatar from '@mui/joy/Avatar';
import AspectRatio from '@mui/joy/AspectRatio';
import './boardSkeleton.css';

const ShortformSkeleton = () => {
  const skeletonArray = Array.from({ length: 4 }, (_, index) => index);

  return (
    <div className="freeboard-card-container">
      {skeletonArray.map(index => (
        <Card
          key={index}
          variant="plain"
          className="freeboard-card"
        >
          <Box className="card-video">
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Box>
          <Box>
            <Skeleton variant="text" width="60%" height={40} style={{ margin: '0' }} />
          </Box>
          <Box className="card-content">
            <Avatar
              size="sm"
              sx={{ '--Avatar-size': '1.5rem' }}
              className="card-avatar"
            >
              <Skeleton variant="circular" width={24} height={24} />
            </Avatar>
            <Box flex="1" style={{ marginLeft: '10px' }}>
              <Skeleton variant="text" width="100%" height={40} />
            </Box>
          </Box>
        </Card>
      ))}
    </div>
  );
};

export default ShortformSkeleton;
