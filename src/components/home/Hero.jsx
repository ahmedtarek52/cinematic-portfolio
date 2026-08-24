import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const heroImages = [
  '/images/hero_01.webp',
  '/images/hero_02.webp',
  '/images/hero_03.webp',
];

// 3D Fold Animation Variants
const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const titleFoldVariants = {
  hidden: {
    opacity: 0,
    rotateX: -85,
    y: 35,
    scale: 0.95,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const descContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.5,
    },
  },
};

const descFoldVariants = {
  hidden: {
    opacity: 0,
    rotateX: -70,
    y: 20,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const titleWords = [
  { text: 'Welcome', isGradient: false },
  { text: 'to', isGradient: false },
  { text: 'Our', isGradient: false },
  { text: 'Creative', isGradient: true },
  { text: 'Studio', isGradient: true },
];

const descriptionText = 'Discover stunning visuals and exceptional design work that brings your vision to life.';
const descWords = descriptionText.split(' ');

// Module-level flag — survives re-mounts (SPA navigation) but resets on full page reload
let hasPlayedCurtain = false;

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const curtainLeftRef = useRef(null);
  const curtainRightRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const slideIndicatorsRef = useRef(null);

  // Curtain reveal effect using GSAP — only on first page load
  useLayoutEffect(() => {
    if (hasPlayedCurtain) {
      // Already played: snap everything to its final state immediately
      gsap.set(curtainLeftRef.current, { xPercent: -100 });
      gsap.set(curtainRightRef.current, { xPercent: 100 });
      return;
    }

    hasPlayedCurtain = true;

    const tl = gsap.timeline();

    tl.to(curtainLeftRef.current, { xPercent: -100, duration: 1, ease: "power3.inOut" }, 0)
      .to(curtainRightRef.current, { xPercent: 100, duration: 1, ease: "power3.inOut" }, 0)
      .from(contentRef.current, { scale: 0.5, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, 0.5)
      .from(scrollIndicatorRef.current, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, 1.1)
      .from(slideIndicatorsRef.current, { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" }, 1.2);

    return () => tl.kill();
  }, []);

  // Auto slide images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    const contentElement = document.getElementById('featured-works');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={heroImages[currentImageIndex]}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </div>

      {/* Curtain Overlays */}
      <div
        ref={curtainLeftRef}
        className="absolute inset-y-0 left-0 w-1/2 z-30"
        style={{ backgroundColor: '#0a0a0a' }}
      />
      <div
        ref={curtainRightRef}
        className="absolute inset-y-0 right-0 w-1/2 z-30"
        style={{ backgroundColor: '#0a0a0a' }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>

      {/* Content Container */}
      <div ref={contentRef} className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white">
        {/* Title with 3D Fold Animation */}
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg tracking-tight"
          variants={titleContainerVariants}
          initial="hidden"
          animate="visible"
          style={{ perspective: 1200 }}
        >
          {titleWords.map((item, idx) => (
            <span
              key={idx}
              className="inline-block mr-[0.28em] last:mr-0 [perspective:1000px]"
            >
              <motion.span
                variants={titleFoldVariants}
                className={`inline-block ${
                  item.isGradient
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white'
                    : 'text-white'
                }`}
                style={{
                  transformOrigin: '50% 100% -15px',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                {item.text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Description with Staggered 3D Fold Animation */}
        <motion.p 
          className="text-lg md:text-2xl mb-8 text-gray-200 drop-shadow-md max-w-2xl mx-auto font-light leading-relaxed"
          variants={descContainerVariants}
          initial="hidden"
          animate="visible"
          style={{ perspective: 1000 }}
        >
          {descWords.map((word, idx) => (
            <span
              key={idx}
              className="inline-block mr-[0.28em] last:mr-0 [perspective:800px]"
            >
              <motion.span
                variants={descFoldVariants}
                className="inline-block"
                style={{
                  transformOrigin: '50% 100%',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.p>
      </div>

      {/* Scroll indicator as CTA */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
        onClick={scrollToContent}
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
      </div>

      {/* Slide Indicators */}
      <div ref={slideIndicatorsRef} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;