import React, { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Film, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllTrailers } from "../../services/trailers";
import TrailerCard from "../ui/TrailerCard";
import CinemaModal from "../ui/CinemaModal";

export const CinematicTrailers = () => {
  const [activeTrailerId, setActiveTrailerId] = useState(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const sectionRef = useRef(null);
  const mobileSliderRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { data: trailers = [] } = useQuery({
    queryKey: ["trailers"],
    queryFn: getAllTrailers,
  });

  // Home page renders only top 3 featured trailers
  const featuredTrailers = useMemo(() => trailers.slice(0, 3), [trailers]);

  // Current active trailer for Cinema Modal
  const activeTrailer = useMemo(() => {
    return trailers.find((t) => t.id === activeTrailerId) || null;
  }, [activeTrailerId, trailers]);

  const activeIndex = useMemo(() => {
    return trailers.findIndex((t) => t.id === activeTrailerId);
  }, [activeTrailerId, trailers]);

  const handleNextTrailer = () => {
    if (trailers.length === 0) return;
    const nextIdx = (activeIndex + 1) % trailers.length;
    setActiveTrailerId(trailers[nextIdx].id);
  };

  const handlePrevTrailer = () => {
    if (trailers.length === 0) return;
    const prevIdx = (activeIndex - 1 + trailers.length) % trailers.length;
    setActiveTrailerId(trailers[prevIdx].id);
  };

  // Mobile slider navigation handlers
  const handleMobileScroll = () => {
    if (!mobileSliderRef.current) return;
    const { scrollLeft, clientWidth } = mobileSliderRef.current;
    const cardWidth = clientWidth * 0.85;
    const index = Math.round(scrollLeft / (cardWidth || 1));
    setActiveMobileIndex(
      Math.min(Math.max(0, index), featuredTrailers.length - 1),
    );
  };

  const scrollToMobileSlide = (index) => {
    if (!mobileSliderRef.current) return;
    const children = mobileSliderRef.current.children;
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
    const next = Math.min(featuredTrailers.length - 1, activeMobileIndex + 1);
    scrollToMobileSlide(next);
  };

  return (
    <section
      ref={sectionRef}
      id="cinematic-trailers"
      aria-label="Featured Cinematic Trailers"
      className="relative py-8 md:py-16 px-4 md:px-6"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-zinc-700/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Dynamic Section Header - Cinema Vault Split Layout */}
      <div className="relative mb-14 pb-6 border-b border-border/60">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Left Column: Eyebrow + Bold Title + Lead */}
          <div className="space-y-3 max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none"
            >
              Cinematic{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
                Trailers
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl pt-1"
            >
              Official promotional trailers, teasers, and theatrical cuts
              engineered with precision color grading, HDR mastering, and
              dynamic audio delivery.
            </motion.p>
          </div>

          {/* Right Column: Direct Vault Showcase Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex-shrink-0"
          >
            <Link
              to="/trailers"
              className="inline-flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-space-800/90 hover:bg-space-700/90 border border-border hover:border-zinc-500 text-white transition-all duration-300 group shadow-lg cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 group-hover:scale-110 transition-transform">
                <Film className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                  Open Trailers Vault
                </p>
                <p className="text-[11px] text-gray-400">
                  Dolby Vision &amp; 5.1 Cuts
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-zinc-200 group-hover:translate-x-1 transition-all ml-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout: 3-column Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {featuredTrailers.map((trailer, index) => (
          <motion.div
            key={trailer.id}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="h-full"
          >
            <TrailerCard
              trailer={trailer}
              onPlay={(t) => setActiveTrailerId(t.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Mobile Responsive Layout: Swipeable Card Slider */}
      <div className="md:hidden relative z-10">
        {/* Horizontal Scroll Track with Native Momentum Snap */}
        <div
          ref={mobileSliderRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 pb-6 pt-1 -mx-4 px-4 touch-pan-x"
        >
          {featuredTrailers.map((trailer) => (
            <div
              key={trailer.id}
              className="w-[85vw] max-w-[340px] flex-shrink-0 snap-center"
            >
              <TrailerCard
                trailer={trailer}
                onPlay={(t) => setActiveTrailerId(t.id)}
              />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Controls & Pagination Dots */}
        <div className="flex items-center justify-between pt-2 px-1">
          {/* Slide Counter / Swipe Cue */}
          <span className="text-[11px] font-mono text-gray-400">
            0{activeMobileIndex + 1} / 0{featuredTrailers.length}
          </span>

          {/* Interactive Pagination Dots */}
          <div className="flex items-center gap-1.5">
            {featuredTrailers.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToMobileSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeMobileIndex === i
                    ? "w-7 bg-zinc-200 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                    : "w-2 bg-white/25 hover:bg-white/50"
                }`}
                aria-label={`Go to trailer ${i + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={scrollToPrevMobileSlide}
              disabled={activeMobileIndex === 0}
              className="p-2 rounded-lg bg-space-800/90 border border-border text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToNextMobileSlide}
              disabled={activeMobileIndex === featuredTrailers.length - 1}
              className="p-2 rounded-lg bg-space-800/90 border border-border text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reusable Cinema Lightbox Modal */}
      <CinemaModal
        activeTrailer={activeTrailer}
        trailersList={trailers}
        activeIndex={activeIndex}
        onClose={() => setActiveTrailerId(null)}
        onNext={handleNextTrailer}
        onPrev={handlePrevTrailer}
      />
    </section>
  );
};

export default CinematicTrailers;
