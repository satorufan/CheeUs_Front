import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './adCarousel.css';

function AdCarousel({ images, interval = 5000 }) {
  return (
    <div className="ad-carousel">
      <Carousel interval={interval}>
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={image.src}
              alt={image.alt}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default AdCarousel;