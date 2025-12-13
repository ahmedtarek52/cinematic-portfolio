import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [text, setText] = useState('');
  const fullText = 'Discover stunning visuals and exceptional design work that brings your vision to life';
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const type = () => {
      if (isDeleting) {
        // Deleting text
        setText(fullText.substring(0, index - 1));
        setIndex(index - 1);
      } else {
        // Typing text
        setText(fullText.substring(0, index + 1));
        setIndex(index + 1);
      }

      // Manage state changes
    //   if (!isDeleting && index === fullText.length) {
    //     // Finished typing, start deleting after pause
    //     setTimeout(() => setIsDeleting(true), 1500);
    //   } else if (isDeleting && index === 0) {
    //     // Finished deleting, start typing again after pause
    //     setIsDeleting(false);
    //     setTimeout(() => setIndex(0), 500);
    //   }
    };

    // Set typing speed
    let speed = 100;
    if (isDeleting) speed = 50;
    if (!isDeleting && index === fullText.length) speed = 1500;
    if (isDeleting && index === 0) speed = 1000;

    const timer = setTimeout(type, speed);
    return () => clearTimeout(timer);
  }, [index, isDeleting, fullText]);

  const scrollToContent = () => {
    const contentElement = document.getElementById('featured-works');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/10480825/pexels-photo-10480825.jpeg)',
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        {/* Title with Fade In Animation */}
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Our Creative Studio
        </motion.h1>

        {/* Description with Typewriter Effect */}
        <motion.p 
          className="text-lg md:text-2xl mb-8 text-gray-100 drop-shadow-md max-w-2xl mx-auto min-h-[3rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {text}
          <span className="inline-block w-1 h-8 ml-1 bg-white align-middle animate-pulse"></span>
        </motion.p>

      </div>

      {/* Scroll indicator as CTA */}
      <motion.div 
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer group"
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        // whileHover={{ y: -5 }}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-sm font-medium group-hover:text-accent transition-colors duration-300">Scroll to explore</p>
          <svg 
            className="w-6 h-6 text-white animate-bounce group-hover:text-accent transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;