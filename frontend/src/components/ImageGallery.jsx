import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ImageGallery({ isCompact = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamically referencing the specific public folder assets requested
  const banners = [
    {
      image: '/ImageGallery_1.png',
      link: '/category/necklace',
    },
    {
      image: '/ImageGallery_2.png',
      link: '/category/ring',
    },
    {
      image: '/ImageGallery_3.png',
      link: '/category/earring',
    }
  ];

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(goToNext, 5000);
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  return (
    <div className={`relative w-full overflow-hidden bg-white ${isCompact ? 'h-full' : ''}`}>
      <div className={`relative w-full overflow-hidden group ${isCompact ? 'h-full' : 'h-[60vh] md:h-[85vh]'}`}>
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${currentIndex === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
              }`}
          >
            <div className="relative h-full w-full">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/1920x1080?text=SilverWale+Collection'; }}
              />

              {/* Premium Overlay Text for Main Slider */}
              {!isCompact && (
                <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center">
                  <div className="px-4 mt-auto mb-20 md:mb-32">
                    <h2 className="text-white text-3xl md:text-6xl font-serif tracking-[0.2em] mb-4 animate-fadeInUp">
                      {banner.title}
                    </h2>
                    <p className="text-white/90 text-sm md:text-xl font-light tracking-[0.3em] mb-12 uppercase animate-fadeInUp delay-100">
                      {banner.subtitle}
                    </p>
                    <Link 
                      to={banner.link}
                      className="inline-block border border-white text-white px-10 py-3 text-[10px] tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-300 uppercase animate-fadeInUp delay-200"
                    >
                      Explore Now
                    </Link>
                  </div>
                </div>
              )}

              {/* Compact version for Sidebar */}
              {isCompact && (
                <div className="absolute inset-x-0 bottom-0 bg-black/20 p-2 text-center backdrop-blur-sm">
                  <p className="text-white text-[8px] tracking-widest uppercase font-medium">
                    {banner.title}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Global Controls */}
        <button
          onClick={(e) => { e.preventDefault(); goToPrevious(); }}
          className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-20 p-2 text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <FaChevronLeft className="h-6 w-6 md:h-10 md:w-10 font-thin" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); goToNext(); }}
          className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-20 p-2 text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <FaChevronRight className="h-6 w-6 md:h-10 md:w-10 font-thin" />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;



