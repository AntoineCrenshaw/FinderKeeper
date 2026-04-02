import { useState } from "react";
import "../components/styling/ImageCarousel.css";

function ImageCarousel({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="carousel-placeholder">
        <div className="no-images-text">No images available</div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="carousel-container">
      <div className="carousel-main">
        <img
          src={currentImage}
          alt={`Slide ${currentIndex + 1}`}
          className="carousel-image"
        />

        {images.length > 1 && (
          <>
            <button
              className="carousel-button prev-button"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="carousel-button next-button"
              onClick={goToNext}
              aria-label="Next image"
            >
              ›
            </button>

            <div className="carousel-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="carousel-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;
