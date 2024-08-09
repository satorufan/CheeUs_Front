import React from 'react';

function NotFoundPage() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
  };

  const imageStyle = {
    maxWidth: '100%', 
    height: '600px', 
    objectFit: 'cover',
    objectPosition: 'center', 
};

  return (
    <div style={containerStyle}>
      <img
        src={`${process.env.PUBLIC_URL}/images/404.png`}
        alt="404 Not Found"
        style={imageStyle}
      />
    </div>
  );
}

export default NotFoundPage;