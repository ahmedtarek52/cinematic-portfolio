import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const CinemaModal = ({
  activeTrailer,
  trailersList,
  activeIndex,
  onClose,
  onNext,
  onPrev
}) => {
  // ESC and Arrow Keys handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeTrailer) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };

    if (activeTrailer) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTrailer, onNext, onPrev, onClose]);

  return (
    <AnimatePresence>
      {activeTrailer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-xl"
        >
          {/* Modal Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#0e0e12] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#14141a]">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-accent/20 text-accent">
                  <Film size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                    {activeTrailer.title}
                    <span className="text-xs font-normal text-gray-400">
                      • {activeTrailer.year}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">{activeTrailer.subtitle}</p>
                </div>
              </div>

              {/* Top Actions: Close & Vimeo link */}
              <div className="flex items-center gap-2">
                {/* <a
                  href={activeTrailer.vimeoReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <span>Vimeo Review</span>
                  <ExternalLink size={13} />
                </a> */}

                <button
                  onClick={onClose}
                  aria-label="Close cinema modal"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 16:9 Vimeo Video Player Frame */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://player.vimeo.com/video/${activeTrailer.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                title={activeTrailer.title}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />

              {/* Floating Navigation Controls */}
              {onPrev && (
                <button
                  onClick={onPrev}
                  aria-label="Previous trailer"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-accent hover:scale-110 transition-all border border-white/15 opacity-70 hover:opacity-100 cursor-pointer shadow-lg hidden sm:flex"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {onNext && (
                <button
                  onClick={onNext}
                  aria-label="Next trailer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-accent hover:scale-110 transition-all border border-white/15 opacity-70 hover:opacity-100 cursor-pointer shadow-lg hidden sm:flex"
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
