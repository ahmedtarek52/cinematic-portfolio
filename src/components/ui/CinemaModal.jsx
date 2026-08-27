import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Normalizes any Vimeo ID, unlisted path, or full Vimeo URL into an embeddable player URL
 */
export function getVimeoEmbedUrl(vimeoInput) {
  if (!vimeoInput) return "";
  const str = String(vimeoInput).trim();

  // If already an embed URL
  if (str.includes("player.vimeo.com/video/")) {
    const hasQuery = str.includes("?");
    return `${str}${hasQuery ? "&" : "?"}autoplay=1&title=0&byline=0&portrait=0`;
  }

  // Handle formats: "1221637520/3b7580d9db", "https://vimeo.com/1221637520/3b7580d9db", "811861466"
  const cleanPath = str
    .replace(/^https?:\/\/(www\.)?vimeo\.com\//i, "")
    .split("?")[0];
  const parts = cleanPath.split("/").filter(Boolean);

  const id = parts[0] || "";
  const hash = parts[1] || "";

  if (!id) return "";

  return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}&` : "?"}autoplay=1&title=0&byline=0&portrait=0`;
}

/**
 * Dynamic Universal Cinema Video Lightbox Modal
 * Used for Showreel, Trailers, Projects, and Case Studies across the app
 */
export const CinemaModal = ({
  video,
  activeTrailer,
  trailersList,
  activeIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}) => {
  // Support both `video` and `activeTrailer` props
  const currentItem = video || activeTrailer;
  const isModalOpen = isOpen !== undefined ? isOpen && !!currentItem : !!currentItem;

  // ESC and Arrow Keys handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, onNext, onPrev, onClose]);

  if (!currentItem) return null;

  const vimeoUrl = getVimeoEmbedUrl(
    currentItem.vimeoId || currentItem.vimeo || currentItem.vimeoReviewUrl || currentItem.videoUrl
  );

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-xl"
        >
          {/* Modal Dialog */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-space-950 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-space-800">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700">
                  <Film size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                    {currentItem.title || "Cinema Player"}
                    {currentItem.year && (
                      <span className="text-xs font-normal text-zinc-400">
                        • {currentItem.year}
                      </span>
                    )}
                  </h3>
                  {currentItem.subtitle && (
                    <p className="text-xs text-zinc-400">{currentItem.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Top Actions: Close button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 16:9 Vimeo Video Player Frame */}
            <div className="relative aspect-video w-full bg-black">
              {vimeoUrl ? (
                <iframe
                  src={vimeoUrl}
                  title={currentItem.title || "Video Player"}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">
                  Video source not available
                </div>
              )}

              {/* Floating Playlist Navigation Controls (Optional) */}
              {onPrev && (
                <button
                  onClick={onPrev}
                  aria-label="Previous video"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-white hover:text-black hover:scale-110 transition-all border border-white/15 opacity-75 hover:opacity-100 cursor-pointer shadow-lg hidden sm:flex"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {onNext && (
                <button
                  onClick={onNext}
                  aria-label="Next video"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-white hover:text-black hover:scale-110 transition-all border border-white/15 opacity-75 hover:opacity-100 cursor-pointer shadow-lg hidden sm:flex"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinemaModal;
