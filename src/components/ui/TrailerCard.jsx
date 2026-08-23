import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, ExternalLink } from 'lucide-react';

export const TrailerCard = ({
  trailer,
  onPlay,
  layout = false,
  initial = { opacity: 0, y: 30 },
  animate = { opacity: 1, y: 0 },
  exit,
  transition = { duration: 0.5 },
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout={layout}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden bg-[#121216] border border-[#2a2a2a] transition-all duration-500 flex flex-col shadow-xl ${className}`}
    >
      {/* Top Video Preview & Poster */}
      <div
        onClick={() => onPlay && onPlay(trailer)}
        className="relative aspect-video w-full overflow-hidden cursor-pointer bg-black/60"
      >
        {/* Poster Image */}
        <img
          src={trailer.thumbnail}
          alt={trailer.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Dark Gradient Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-black/50 opacity-85 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Floating Category & Year Chips */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-sm">
            {trailer.category}
          </span>
          {/* <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-accent/80 backdrop-blur-sm text-white shadow-sm">
            {trailer.year}
          </span> */}
        </div>

        {/* Pulsing Central Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div
              className={`absolute w-16 h-16 rounded-full bg-accent/30 transition-transform duration-700 ease-out ${
                isHovered ? 'scale-150 opacity-100 animate-ping' : 'scale-100 opacity-0'
              }`}
            />
            <div
              className={`w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                isHovered
                  ? 'scale-110 bg-accent text-white border-accent shadow-[0_0_25px_rgba(0,68,255,0.7)]'
                  : 'scale-100'
              }`}
            >
              <Play size={22} className="ml-1 fill-current" />
            </div>
          </div>
        </div>

        {/* Duration Badge Bottom Right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-black/75 backdrop-blur-md text-white/90 border border-white/10 shadow-md">
          <Clock size={12} className="text-accent" />
          <span>{trailer.duration}</span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold">
              {trailer.client}
            </span>
            <span className="text-xs text-gray-500">{trailer.genre}</span>
          </div>

          <h3
            onClick={() => onPlay && onPlay(trailer)}
            className="text-xl font-bold text-white transition-colors duration-300 cursor-pointer"
          >
            {trailer.title}
          </h3>

          <p className="text-xs text-gray-400 font-medium mb-3">
            {trailer.subtitle}
          </p>

          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {trailer.description}
          </p>
        </div>

        {/* Tech Specs & Tags */}
        <div className="space-y-4 pt-2 border-t border-[#2a2a2a]/60">
          <div className="flex flex-wrap gap-1.5">
            {trailer.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-gray-300 bg-space-800/90 px-2 py-0.5 rounded border border-[#2a2a2a] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Card Action Buttons */}
          {/* <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={() => onPlay && onPlay(trailer)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-accent text-white font-medium text-xs sm:text-sm hover:bg-blue-600 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,68,255,0.3)] hover:shadow-[0_0_20px_rgba(0,68,255,0.5)] cursor-pointer"
            >
              <Play size={14} className="fill-current" />
              <span>Watch Trailer</span>
            </button>

            <a
              href={trailer.vimeoReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Vimeo Review Page"
              className="p-2.5 rounded-lg bg-space-800 text-gray-400 hover:text-white hover:bg-space-700 border border-[#2a2a2a] hover:border-white/20 transition-all cursor-pointer flex items-center justify-center"
            >
              <ExternalLink size={16} />
            </a>
          </div> */}
        </div>
      </div>
    </motion.div>
  );
};

export default TrailerCard;
