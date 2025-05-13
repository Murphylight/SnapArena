"use client";

import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

// Custom arrow components
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
    aria-label="Previous slide"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  </button>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
    aria-label="Next slide"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  </button>
);

const HomeSlider: React.FC = () => {
  const { t } = useTranslation();

  // Ensure styles are loaded / Assurer que les styles sont chargés
  useEffect(() => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css';
    document.head.appendChild(linkElement);

    const linkThemeElement = document.createElement('link');
    linkThemeElement.rel = 'stylesheet';
    linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css';
    document.head.appendChild(linkThemeElement);

    return () => {
      document.head.removeChild(linkElement);
      document.head.removeChild(linkThemeElement);
    };
  }, []);

  const slides = [
    {
      title: t('slider.unityGames.title'),
      description: t('slider.unityGames.description'),
      image: 'https://picsum.photos/800/600?random=1',
      link: '/games'
    },
    {
      title: t('slider.placeBets.title'),
      description: t('slider.placeBets.description'),
      image: 'https://picsum.photos/800/600?random=2',
      link: '/betting'
    },
    {
      title: t('slider.globalCompetition.title'),
      description: t('slider.globalCompetition.description'),
      image: 'https://picsum.photos/800/600?random=3',
      link: '/competition'
    },
    {
      title: t('slider.instantRewards.title'),
      description: t('slider.instantRewards.description'),
      image: 'https://picsum.photos/800/600?random=4',
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
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    customPaging: () => (
      <div className="w-2 h-2 bg-white/50 rounded-full transition-all duration-300 hover:bg-white" />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="relative" role="region" aria-label="Featured content slider">
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
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex items-center justify-center">
                <div className="text-center text-white p-4 max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-lg md:text-xl mb-8">{slide.description}</p>
                  <a
                    href={slide.link}
                    className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                    aria-label={`Learn more about ${slide.title}`}
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