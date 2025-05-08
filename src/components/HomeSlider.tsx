"use client";

import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeSlider: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Assurer que les styles sont chargés
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css';
    document.head.appendChild(linkElement);

    const linkThemeElement = document.createElement('link');
    linkThemeElement.rel = 'stylesheet';
    linkThemeElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css';
    document.head.appendChild(linkThemeElement);

    return () => {
      document.head.removeChild(linkElement);
      document.head.removeChild(linkThemeElement);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
    arrows: true,
  };

  const sliderItems = [
    {
      id: 1,
      title: t('home.slides.1.title'),
      description: t('home.slides.1.description'),
      image: 'https://via.placeholder.com/800x600/FF5733/FFFFFF?text=Unity+Games',
    },
    {
      id: 2,
      title: t('home.slides.2.title'),
      description: t('home.slides.2.description'),
      image: 'https://via.placeholder.com/800x600/33FF57/FFFFFF?text=Place+Bets',
    },
    {
      id: 3,
      title: t('home.slides.3.title'),
      description: t('home.slides.3.description'),
      image: 'https://via.placeholder.com/800x600/3357FF/FFFFFF?text=Global+Competition',
    },
    {
      id: 4,
      title: t('home.slides.4.title'),
      description: t('home.slides.4.description'),
      image: 'https://via.placeholder.com/800x600/FF33A8/FFFFFF?text=Instant+Rewards',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Slider {...settings}>
        {sliderItems.map((item) => (
          <div key={item.id} className="outline-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative aspect-w-16 aspect-h-9">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeSlider; 