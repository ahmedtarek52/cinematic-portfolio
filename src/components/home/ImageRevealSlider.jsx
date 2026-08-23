import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Film,
  Camera,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

export const ImageRevealSlider = () => {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [activeLayerLabel, setActiveLayerLabel] = useState(
    "50% RAW / 50% Grade",
  );

  // Motion Value normalized 0 -> 1 (tracks divider position)
  const x = useMotionValue(0.5);

  // Derived transforms for Split Reveal
  const splitClipGrade = useTransform(x, (val) => `inset(0 0 0 ${val * 100}%)`);
  const splitDividerLeft = useTransform(x, (val) => `${val * 100}%`);

  // Update dynamic layer label based on slider coordinate
  useEffect(() => {
    const unsubscribeX = x.on("change", (currX) => {
      if (currX <= 0.05) {
        setActiveLayerLabel("100% RAW Sensor Flat");
      } else if (currX >= 0.95) {
        setActiveLayerLabel("100% Master Color Grade");
      } else {
        setActiveLayerLabel(
          `${Math.round((1 - currX) * 100)}% RAW / ${Math.round(currX * 100)}% Grade`,
        );
      }
    });

    return () => unsubscribeX();
  }, [x]);

  // Auto-sweep animation controller (ping-pong smoothly from left to right)
  useEffect(() => {
    let isCancelled = false;

    const runSweep = async () => {
      while (isPlaying && !isCancelled) {
        await animate(x, 0.08, { duration: 2.6, ease: [0.42, 0, 0.58, 1] });
        if (!isPlaying || isCancelled) break;
        await animate(x, 0.92, { duration: 2.6, ease: [0.42, 0, 0.58, 1] });
      }
    };

    if (isPlaying) {
      runSweep();
    }

    return () => {
      isCancelled = true;
    };
  }, [isPlaying, x]);

  // Unified pointer down handler that keeps line and puck handle 100% anchored together
  const handlePointerDownSplit = (e) => {
    e.stopPropagation();
    setIsPlaying(false);
    setIsDragging(true);

    const updatePosition = (clientX) => {
      if (!containerRef.current || clientX === undefined) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      x.set(newX);
    };

    updatePosition(e.clientX ?? e.touches?.[0]?.clientX);

    const onPointerMove = (moveEvent) => {
      const clientX = moveEvent.clientX ?? moveEvent.touches?.[0]?.clientX;
      if (clientX !== undefined) updatePosition(clientX);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
  };

  // Handle pointer coordinate updates when clicking anywhere on the container
  const handlePointerDownContainer = (e) => {
    if (!containerRef.current) return;
    setIsPlaying(false);
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    if (clientX === undefined) return;

    const newX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    animate(x, newX, { type: "spring", stiffness: 350, damping: 28 });
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      setIsPlaying(false);
      const step = e.shiftKey ? 0.1 : 0.03;
      const currentX = x.get();

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          animate(x, Math.max(0, currentX - step), {
            duration: 0.15,
            ease: "easeOut",
          });
          break;
        case "ArrowRight":
          e.preventDefault();
          animate(x, Math.min(1, currentX + step), {
            duration: 0.15,
            ease: "easeOut",
          });
          break;
        case "Home":
          e.preventDefault();
          animate(x, 0, { duration: 0.3, ease: "easeOut" });
          break;
        case "End":
          e.preventDefault();
          animate(x, 1, { duration: 0.3, ease: "easeOut" });
          break;
        case "1":
          animate(x, 0.02, { duration: 0.3, ease: "easeOut" });
          break;
        case "2":
          animate(x, 0.98, { duration: 0.3, ease: "easeOut" });
          break;
        case "r":
        case "R":
          animate(x, 0.5, { duration: 0.35, ease: "easeOut" });
          break;
        case " ":
        case "p":
        case "P":
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        default:
          break;
      }
    },
    [x],
  );

  // Quick jump presets
  const jumpTo = (targetX) => {
    setIsPlaying(false);
    animate(x, targetX, { type: "spring", stiffness: 300, damping: 25 });
  };

  return (
    <section
      id="color-grading-reveal"
      className="relative py-8 md:py-16 max-w-7xl mx-auto px-4 md:px-6"
      aria-label="Interactive Color Grading Reveal Slider"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-accent/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="relative text-center mb-16 space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
        >
          Color Grading Reveal
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Drag the interactive slider or use keyboard arrow keys to inspect the
          cinematic color grading transformation in real time.
        </motion.p>
      </div>

      {/* Control Bar: Status Label, Auto-Play, Center Reset, HUD Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 bg-zinc-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-xl">
        {/* Active Split Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-xs">
          <Film className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">
            Reveal:
          </span>
          <span className="font-mono text-blue-400 font-bold">
            {activeLayerLabel}
          </span>
        </div>

        {/* Quick Actions: Auto-Sweep, Reset to Center, Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer ${
              isPlaying
                ? "bg-accent text-white shadow-[0_0_20px_rgba(0,68,255,0.4)]"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title="Auto sweep playback (Space / P)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto Sweep</span>
              </>
            )}
          </button>

          <button
            onClick={() => jumpTo(0.5)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to 50/50 Center (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowMetadata((prev) => !prev)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              showMetadata
                ? "bg-accent/20 text-blue-400 border border-accent/40"
                : "bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white"
            }`}
            title="Toggle Colorist HUD Metadata"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="slider"
        aria-label="Image Comparison Reveal Slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(x.get() * 100)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDownContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
        }}
        className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[640px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-950 cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-accent transition-shadow z-10"
      >
        {/* Layer 1: Base RAW Flat Image (Before Edit) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/before_edit.webp"
            alt="Raw Ungraded Flat Footage"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          {/* RAW watermark tag */}
          <div className="absolute top-4 left-4 pointer-events-none z-10">
            <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono font-medium text-zinc-300 tracking-wider">
              RAW LOG • ARRI RAW
            </span>
          </div>
        </div>

        {/* Layer 2: Final Master Color Grade (After Edit) - Clipped by Slider */}
        <motion.div
          style={{ clipPath: splitClipGrade }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <img
            src="/images/after_edit.webp"
            alt="Final Master Color Grade"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>

        {/* Right Label (Master Grade Watermark) */}
        <div className="absolute top-4 right-4 pointer-events-none z-10">
          <span className="px-2.5 py-1 rounded-md bg-accent/20 backdrop-blur-md border border-accent/40 text-[11px] font-mono font-semibold text-blue-300 tracking-wider">
            MASTER GRADE • 2.40:1
          </span>
        </div>

        {/* Cinematic Film Overlay */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 z-10" />

        {/* Sliding Divider Line & Handle (100% Unified & Locked) */}
        <motion.div
          style={{ left: splitDividerLeft }}
          onPointerDown={handlePointerDownSplit}
          className="absolute top-0 bottom-0 z-30 -translate-x-1/2 flex items-center justify-center cursor-ew-resize select-none touch-none pointer-events-auto"
        >
          {/* Full-height glowing blue divider line */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-blue-400/90 shadow-[0_0_15px_rgba(0,68,255,0.8)]" />

          {/* Invisible expanded grab hit-area for effortless dragging */}
          <div className="absolute top-0 bottom-0 w-14 -left-7" />

          {/* Center circular puck handle - permanently anchored to the line */}
          <div className="relative z-10 w-12 h-12 rounded-full bg-black/90 backdrop-blur-xl border-2 border-blue-400 shadow-2xl flex items-center justify-center group hover:scale-110 active:scale-95 transition-transform pointer-events-auto">
            <div className="flex items-center gap-0.5 text-blue-400">
              <ChevronLeft className="w-4 h-4 -mr-1" />
              <div className="w-1 h-4 bg-blue-400 rounded-full" />
              <ChevronRight className="w-4 h-4 -ml-1" />
            </div>

            {/* Pulsing ring indicator */}
            <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping pointer-events-none opacity-40" />
          </div>
        </motion.div>

        {/* Bottom Status Ribbon Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs">
            <span className="text-zinc-400 font-mono">
              Before / After Slider
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300">
            <span>Divider: {Math.round(x.get() * 100)}%</span>
          </div>
        </div>

        {/* Colorist Metadata HUD Modal (Toggleable) */}
        <AnimatePresence>
          {showMetadata && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="absolute inset-0 bg-black/85 z-40 p-6 md:p-8 flex flex-col justify-center text-white"
            >
              <div className="max-w-xl mx-auto w-full bg-zinc-900/90 border border-blue-500/30 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Camera className="w-5 h-5" />
                    <h4 className="font-bold text-base tracking-wide uppercase">
                      DaVinci Color Pipeline HUD
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowMetadata(false)}
                    className="text-zinc-400 hover:text-white text-xs font-mono px-2 py-1 bg-white/10 rounded-md cursor-pointer"
                  >
                    ESC / Close
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <span className="text-zinc-500 block text-[10px]">
                      COLOR SPACE
                    </span>
                    <span className="text-zinc-200 font-semibold">
                      ACEScc / AP1
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <span className="text-zinc-500 block text-[10px]">
                      CAMERA SENSOR
                    </span>
                    <span className="text-zinc-200 font-semibold">
                      ARRI LF 4.5K
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <span className="text-zinc-500 block text-[10px]">
                      PRINT LUT
                    </span>
                    <span className="text-blue-400 font-semibold">
                      Kodak 2383 35mm
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <span className="text-zinc-500 block text-[10px]">
                      GRAIN STRUCTURE
                    </span>
                    <span className="text-zinc-200 font-semibold">
                      35mm 500T Stock
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <span className="text-zinc-500 block text-[10px]">
                      DYNAMIC RANGE
                    </span>
                    <span className="text-zinc-200 font-semibold">
                      14.5+ Stops
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <span className="text-zinc-500 block text-[10px]">
                      TARGET EXPORT
                    </span>
                    <span className="text-zinc-200 font-semibold">
                      DCI-P3 / HDR10
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-zinc-400 leading-relaxed font-sans">
                  The interactive reveal engine renders hardware-accelerated
                  clip paths directly matching production grade delivery
                  masters.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick-Jump Snap Presets & Keyboard Help Bar */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[11px] mr-1">
            Quick Jump:
          </span>
          <button
            onClick={() => jumpTo(0.02)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-accent/60 hover:text-white transition-all cursor-pointer"
          >
            0% RAW Flat [1]
          </button>
          <button
            onClick={() => jumpTo(0.5)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-accent/60 hover:text-blue-400 transition-all cursor-pointer"
          >
            50/50 Split [R]
          </button>
          <button
            onClick={() => jumpTo(0.98)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-accent/60 hover:text-white transition-all cursor-pointer"
          >
            100% Master Grade [2]
          </button>
        </div>

        {/* Keyboard Shortcut Hints */}
        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-zinc-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">
              →
            </kbd>{" "}
            Slide
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">
              Home
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">
              End
            </kbd>{" "}
            Full
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">
              Space
            </kbd>{" "}
            Auto Sweep
          </span>
        </div>
      </div>
    </section>
  );
};

export default ImageRevealSlider;
