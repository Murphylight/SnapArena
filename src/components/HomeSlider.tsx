"use client";

import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

// Ensure styles are loaded / Assurer que les styles sont chargés
useEffect(() => {
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

const HomeSlider: React.FC = () => {
  const { t } = useTranslation();

  const slides = [
    {
      title: t('slider.unityGames.title'),
      description: t('slider.unityGames.description'),
      image: 'https://via.placeholder.com/800x600/FF5733/FFFFFF?text=Unity+Games',
      link: '/games'
    },
    {
      title: t('slider.placeBets.title'),
      description: t('slider.placeBets.description'),
      image: 'https://via.placeholder.com/800x600/33FF57/FFFFFF?text=Place+Bets',
      link: '/betting'
    },
    {
      title: t('slider.globalCompetition.title'),
      description: t('slider.globalCompetition.description'),
      image: 'https://via.placeholder.com/800x600/3357FF/FFFFFF?text=Global+Competition',
      link: '/competition'
    },
    {
      title: t('slider.instantRewards.title'),
      description: t('slider.instantRewards.description'),
      image: 'https://via.placeholder.com/800x600/FF33A8/FFFFFF?text=Instant+Rewards',
      link: '/rewards'
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true
  };

  return (
    <div className="relative">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-[400px] md:h-[500px]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-lg md:text-xl mb-8">{slide.description}</p>
                  <a
                    href={slide.link}
                    className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                  >
                    {t('common.learnMore')}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeSlider; 