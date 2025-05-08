"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {/* Logo Icon */}
        <motion.div
          className="relative rounded-full bg-gradient-to-r from-amber-500 to-orange-600 p-2 mr-3"
          initial={{ rotate: 0 }}
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity,
            repeatType: 'loop',
            duration: 5,
            ease: 'easeInOut',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-10 h-10"
          >
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
          </svg>
        </motion.div>

        {/* Text "SnapArena" */}
        <div className="flex flex-col">
          <motion.span
            className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-transparent bg-clip-text"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            SnapArena
          </motion.span>
          <motion.span
            className="text-xs text-gray-600 dark:text-gray-400 italic"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Play. Win. Repeat.
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLogo; 