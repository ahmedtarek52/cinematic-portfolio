import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  {
    id: 1,
    url: "/images/art_01.png",
    alt: "Abstract Art 1",
    title: "Colorful Waves",
    description: "Vibrant abstract composition with flowing lines",
  },
  {
    id: 2,
    url: "/images/art_02.png",
    alt: "Abstract Art 2",
    title: "Geometric Harmony",
    description: "Bold shapes and contrasting colors in perfect balance",
  },
  {
    id: 3,
    url: "/images/art_03.png",
    alt: "Abstract Art 3",
    title: "Midnight Dreams",
    description: "Deep blues and purples creating a dreamy atmosphere",
  },
  {
    id: 4,
    url: "/images/art_04.png",
    alt: "Abstract Art 4",
    title: "Sunset Embrace",
    description: "Warm oranges and reds blending into soft yellows",
  },
  {
    id: 5,
    url: "/images/art_05.png",
    alt: "Abstract Art 5",
    title: "Ocean Depths",
    description: "Cool greens and blues evoking underwater tranquility",
  },
  {
    id: 6,
    url: "/images/art_06.png",
    alt: "Abstract Art 6",
    title: "Desert Mirage",
    description: "Earthy tones and textures inspired by desert landscapes",
  },
];

export const ArtCollection = () => {
  const [activeImageId, setActiveImageId] = useState(2);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const sectionRef = useRef(null);
  const mobileGalleryRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Mobile slider navigation handlers
  const handleMobileScroll = () => {
    if (!mobileGalleryRef.current) return;
    const { scrollLeft, clientWidth } = mobileGalleryRef.current;
    const cardWidth = clientWidth * 0.82;
    const index = Math.round(scrollLeft / (cardWidth || 1));
    setActiveMobileIndex(Math.min(Math.max(0, index), images.length - 1));
  };

  const scrollToMobileSlide = (index) => {
    if (!mobileGalleryRef.current) return;
    const children = mobileGalleryRef.current.children;
    if (children && children[index]) {
      children[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveMobileIndex(index);
    }
  };

  const scrollToPrevMobileSlide = () => {
    const prev = Math.max(0, activeMobileIndex - 1);
    scrollToMobileSlide(prev);
  };

  const scrollToNextMobileSlide = () => {
    const next = Math.min(images.length - 1, activeMobileIndex + 1);
    scrollToMobileSlide(next);
  };

  return (
    <section
      ref={sectionRef}
      id="art-collection"
      aria-label="Visual Art Collection"
      className="relative py-8 md:py-16 px-4 md:px-6"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-zinc-700/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="relative text-center mb-16 space-y-4">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
        >
          Visual Art{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
            Collection
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Explore our gallery of conceptual art, look development frames, and
          color studies shaping contemporary visual aesthetics.
        </motion.p>
      </div>

      {/* Desktop Gallery: Expandable Accordion (100% Unchanged on Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 hidden md:flex w-full gap-3 sm:gap-4 md:gap-5 h-80 sm:h-96 md:h-[480px]"
      >
        {images.map((image) => {
          const isActive = activeImageId === image.id;
          return (
            <div
              key={image.id}
              className="relative min-w-0 h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer border border-border/60 bg-space-800"
              style={{
                flex: isActive ? 3.5 : 1,
                transition: "flex 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
              onClick={() => setActiveImageId(image.id)}
              onMouseEnter={() => setActiveImageId(image.id)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Overlay for active image */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6 transition-opacity duration-500 ${
                  isActive
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl truncate">
                  {image.title}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-2">
                  {image.description}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Mobile Gallery: Touch Swipeable Slider (< md) */}
      <div className="md:hidden relative z-10">
        <div
          ref={mobileGalleryRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 pb-4 -mx-4 px-4 touch-pan-x"
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="w-[82vw] max-w-[340px] aspect-[4/5] flex-shrink-0 snap-center rounded-2xl overflow-hidden shadow-xl border border-border/60 bg-space-800 relative group cursor-pointer"
              onClick={() => scrollToMobileSlide(index)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Frame Badge */}
              <div className="absolute top-3.5 right-3.5 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-sm">
                  0{image.id} / 0{images.length}
                </span>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                <h3 className="text-white font-bold text-xl truncate">
                  {image.title}
                </h3>
                <p className="text-white/80 text-xs mt-1.5 leading-relaxed line-clamp-2">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Controls & Pagination Dots */}
        <div className="flex items-center justify-between pt-2 px-1">
          {/* Slide Counter */}
          <span className="text-[11px] font-mono text-gray-400">
            0{activeMobileIndex + 1} / 0{images.length}
          </span>

          {/* Interactive Pagination Dots */}
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToMobileSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeMobileIndex === i
                    ? "w-7 bg-zinc-200 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                    : "w-2 bg-white/25 hover:bg-white/50"
                }`}
                aria-label={`Go to artwork ${i + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={scrollToPrevMobileSlide}
              disabled={activeMobileIndex === 0}
              className="p-2 rounded-lg bg-space-800/90 border border-border text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all cursor-pointer"
              aria-label="Previous artwork"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToNextMobileSlide}
              disabled={activeMobileIndex === images.length - 1}
              className="p-2 rounded-lg bg-space-800/90 border border-border text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all cursor-pointer"
              aria-label="Next artwork"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtCollection;

