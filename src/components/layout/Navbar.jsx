import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "Trailers", path: "/trailers" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock document & body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("mobile-menu-open");
      document.body.classList.add("mobile-menu-open");
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.classList.remove("mobile-menu-open");
      document.body.classList.remove("mobile-menu-open");
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.classList.remove("mobile-menu-open");
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Determine if we're on the home page
  const isHomePage = location.pathname === "/";

  // Film Curtain Variants with realistic 3D unrolling & soft cinematic bounce
  const curtainVariants = {
    initial: {
      opacity: 0,
      scaleY: 0.001,
      y: "-15%",
      rotateX: -18,
    },
    animate: {
      opacity: [0, 1, 1, 1],
      scaleY: [0.001, 1.035, 0.985, 1],
      y: ["-15%", "1.5%", "-0.5%", "0%"],
      rotateX: [-18, 4, -1.5, 0],
      transition: {
        duration: 0.65,
        times: [0, 0.6, 0.82, 1],
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05,
        delayChildren: 0.12,
      },
    },
    exit: {
      opacity: [1, 1, 0],
      scaleY: [1, 0.96, 0.001],
      y: ["0%", "-3%", "-25%"],
      rotateX: [0, -5, -20],
      transition: {
        duration: 0.38,
        times: [0, 0.25, 1],
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.025,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    initial: {
      opacity: 0,
      y: -14,
      scale: 0.97,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.97,
      transition: {
        duration: 0.18,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      <header
        className={`w-full px-6 py-3.5 fixed top-0 left-0 z-[100] transition-colors duration-300 ${
          isOpen
            ? "bg-black/95 border-b border-gray-800"
            : isHomePage
            ? scrolled
              ? "bg-black/80 backdrop-blur-md border-b border-gray-800"
              : "bg-transparent"
            : "bg-black/80 backdrop-blur-md border-b border-gray-800"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex flex-col flex-shrink-0 leading-tight z-[100] group cursor-pointer"
          >
            <span className="text-lg font-bold text-white tracking-wider group-hover:text-gray-200 transition-colors">
              MAHMOUD
            </span>
            <span className="text-xs font-medium text-gray-400 tracking-widest group-hover:text-gray-300 transition-colors">
              ABO HUSSEIN
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-5 font-semibold ml-auto text-sm items-center">
            {navItems.map((item) => {
              const isProjects = item.label === "Projects";
              const isProjectPage = location.pathname.startsWith("/projects");

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => {
                    const isProjectActive = isProjects
                      ? isActive || isProjectPage
                      : isActive;

                    return `transition px-3 py-1.5 rounded-lg ${
                      isProjectActive
                        ? "bg-space-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-space-800"
                    }`;
                  }}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile animated toggle button */}
          <button
            type="button"
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[100] text-white rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all focus:outline-none cursor-pointer select-none pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-5 h-[2px] bg-white rounded-full block origin-center pointer-events-none"
            />
            <motion.span
              animate={
                isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
              }
              transition={{ duration: 0.18 }}
              className="w-5 h-[2px] bg-white rounded-full block pointer-events-none"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-5 h-[2px] bg-white rounded-full block origin-center pointer-events-none"
            />
          </button>
        </div>
      </header>

      {/* Full-Width Mobile Film Curtain Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] md:hidden overflow-hidden bg-black/80 backdrop-blur-md touch-none overscroll-none select-none"
            style={{ perspective: "1200px" }}
            onClick={() => setIsOpen(false)}
          >
            {/* Falling Film Curtain */}
            <motion.div
              variants={curtainVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              className="relative z-10 w-full h-[100dvh] bg-black/98 border-b border-gray-800 shadow-2xl flex flex-col pt-20 pb-10 px-6 sm:px-12 overflow-hidden touch-none overscroll-none will-change-transform"
            >
              {/* Navigation Items */}
              <div className="w-full max-w-md mx-auto flex flex-col gap-2 py-4">
                {navItems.map((item) => {
                  const isProjects = item.label === "Projects";
                  const isProjectPage = location.pathname.startsWith("/projects");
                  const isItemActive = isProjects
                    ? location.pathname === "/projects" || isProjectPage
                    : location.pathname === item.path;

                  return (
                    <motion.div
                      key={item.label}
                      variants={itemVariants}
                      className="w-full"
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center justify-between w-full px-5 py-4 rounded-xl transition-all duration-200 ${
                          isItemActive
                            ? "bg-space-800 text-white font-semibold border border-gray-700/60"
                            : "text-gray-400 hover:text-white hover:bg-space-800/60 border border-transparent"
                        }`}
                      >
                        <span className="text-2xl font-bold tracking-wide uppercase transition-transform group-hover:translate-x-1 duration-200">
                          {item.label}
                        </span>

                        {isItemActive ? (
                          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        ) : (
                          <ArrowUpRight
                            size={18}
                            className="text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

