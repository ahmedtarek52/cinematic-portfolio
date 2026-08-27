import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, ExternalLink } from 'lucide-react';
import { getOptimizedUrl } from '../../lib/cloudinary';

export const TrailerCard = ({
  trailer,
  onPlay,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden bg-space-800 border border-border group-hover:border-zinc-500 transition-all duration-500 flex flex-col shadow-xl group-hover:shadow-[0_0_35px_rgba(255,255,255,0.15)] h-full ${className}`}
    >
      {/* Top Video Preview & Poster */}
      <div
        onClick={() => onPlay && onPlay(trailer)}
        className="relative aspect-video w-full overflow-hidden cursor-pointer bg-black/60"
      >
        {/* Poster Image */}
        <img
          src={
            trailer.thumbnail
              ? getOptimizedUrl(trailer.thumbnail, { width: 800 })
              : trailer.vimeoId
              ? `https://vumbnail.com/${trailer.vimeoId}.jpg`
              : ""
          }
          alt={trailer.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Fallback tier 1: try raw unoptimized thumbnail if different
            if (trailer.thumbnail && e.currentTarget.src !== trailer.thumbnail) {
              e.currentTarget.src = trailer.thumbnail;
              return;
            }
            // Fallback tier 2: try Vimeo thumbnail via vumbnail
            if (trailer.vimeoId && !e.currentTarget.src.includes("vumbnail.com")) {
              e.currentTarget.src = `https://vumbnail.com/${trailer.vimeoId}.jpg`;
              return;
            }
            // Fallback tier 3: hide broken image cleanly
            e.currentTarget.style.display = "none";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Dark Gradient Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-space-800 via-transparent to-black/50 opacity-85 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Floating Category & Year Chips */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-black/60 backdrop-blur-md text-white/90 border border-white/10 shadow-sm">
            {trailer.category}
          </span>
        </div>

        {/* Pulsing Central Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div
              className={`absolute w-16 h-16 rounded-full bg-white/20 transition-transform duration-700 ease-out ${
                isHovered ? 'scale-150 opacity-100 animate-ping' : 'scale-100 opacity-0'
              }`}
            />
            <div
              className={`w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                isHovered
                  ? 'scale-110 bg-zinc-100 text-zinc-950 border-white shadow-[0_0_25px_rgba(255,255,255,0.4)]'
                  : 'scale-100'
              }`}
            >
              <Play size={22} className="ml-1 fill-current" />
            </div>
          </div>
        </div>

        {/* Duration Badge Bottom Right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-black/75 backdrop-blur-md text-white/90 border border-white/10 shadow-md">
          <Clock size={12} className="text-zinc-300" />
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
            className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors duration-300 cursor-pointer"
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
        <div className="space-y-4 pt-2 border-t border-border/60">
          <div className="flex flex-wrap gap-1.5">
            {trailer.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-gray-300 bg-space-800/90 px-2 py-0.5 rounded border border-border transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerCard;
