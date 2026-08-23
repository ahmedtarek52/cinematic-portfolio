import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getOptimizedUrl } from "../../lib/cloudinary";

const ProjectCard = ({ project }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for silky magnetic cursor box following
  const springConfig = { damping: 22, stiffness: 280, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);
    setSpotlightPos({ x, y });
  };

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
      setSpotlightPos({ x, y });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block h-full select-none focus:outline-none"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#121216] border border-[#2a2a2a] group-hover:border-accent/60 transition-all duration-500 shadow-xl group-hover:shadow-[0_0_35px_rgba(0,68,255,0.25)] md:cursor-none cursor-pointer"
      >
        {/* Project Thumbnail Image with Cinematic Scale */}
        <img
          src={getOptimizedUrl(project.thumbnail, { width: 800 })}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

        {/* Interactive Magic Spotlight Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
          style={{
            background: isHovered
              ? `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(0, 68, 255, 0.28), transparent 70%)`
              : "none",
          }}
        />

        {/* Magic Floating Cursor Box (Follows Mouse with Project Title) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                left: cursorX,
                top: cursorY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              className="absolute pointer-events-none z-30 hidden md:flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/85 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(0,68,255,0.45),0_10px_25px_rgba(0,0,0,0.8)]"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#0044ff]" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white tracking-wide leading-tight whitespace-nowrap">
                  {project.title}
                </span>
                {project.services && project.services.length > 0 && (
                  <span className="text-[10px] text-blue-300/90 font-medium tracking-wider uppercase leading-none mt-0.5">
                    {project.services.join(" • ")}
                  </span>
                )}
              </div>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/90 ml-0.5 flex-shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Fallback Overlay (Visible on Touch Devices < md) */}
        <div className="md:hidden absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between pointer-events-none z-20">
          <div>
            <h3 className="text-white font-bold text-base leading-snug">
              {project.title}
            </h3>
            {project.services && (
              <p className="text-[11px] text-blue-300 font-medium">
                {project.services.join(" • ")}
              </p>
            )}
          </div>
          <div className="w-7 h-7 rounded-full bg-accent/80 flex items-center justify-center text-white">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;

