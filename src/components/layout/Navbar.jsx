import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Play, Menu, X } from "lucide-react";
import CinemaModal from "../ui/CinemaModal";

const SHOWREEL_VIDEO = {
  title: "SHOWREEL MASTER FINAL",
  subtitle: "Cinematic Color Grading & Editorial",
  vimeoId: "1221637520/3b7580d9db",
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    "Home",
    "Projects",
    "Trailers",
    // "Services",
    "About",
    // "Careers",
    "Contact",
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

  // Determine if we're on the home page
  const isHomePage = location.pathname === "/";

  return (
    <>
      <header
        className={`w-full px-6 py-3 fixed top-0 z-50 transition-all duration-300 ${
          isHomePage
            ? scrolled
              ? "bg-black/80 backdrop-blur-md border-b border-border"
              : "bg-transparent"
            : "bg-black/80 backdrop-blur-md border-b border-border"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col flex-shrink-0 leading-tight">
            <span className="text-sm font-medium text-white tracking-widest">
              MAHMOUD
            </span>
            <span className="text-lg font-bold text-gray-300 tracking-wide">
              ABO HUSSEIN
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-5 font-semibold ml-auto text-sm items-center">
            {navItems.map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              const isProjects = item === "Projects";
              const isProjectPage = location.pathname.startsWith("/projects");

              return (
                <NavLink
                  key={item}
                  to={path}
                  className={({ isActive }) => {
                    // For Projects, also check if we're on a project details page
                    const isProjectActive = isProjects
                      ? isActive || isProjectPage
                      : isActive;

                    return `transition px-3 py-1.5 rounded-lg ${
                      isProjectActive
                        ? "bg-space-800 text-white "
                        : "text-gray-400 hover:text-white hover:bg-space-800"
                    }`;
                  }}
                >
                  {item}
                </NavLink>
              );
            })}

            {/* Showreel button */}
            <button
              onClick={() => setShowreelOpen(true)}
              className="flex items-center gap-2 bg-zinc-100 text-zinc-950 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] border border-white cursor-pointer ml-2"
            >
              <Play size={14} className="fill-current" />
              <span>Showreel</span>
            </button>
          </nav>

          {/* Mobile toggle button */}
          <button
            className="md:hidden text-white ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-3 bg-space-800 border-t border-space-700 p-4 rounded-lg">
            {navItems.map((item) => {
              const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              const isProjects = item === "Projects";
              const isProjectPage = location.pathname.startsWith("/projects");

              return (
                <NavLink
                  key={item}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => {
                    // For Projects, also check if we're on a project details page
                    const isProjectActive = isProjects
                      ? isActive || isProjectPage
                      : isActive;

                    return `transition px-3 py-2 rounded-lg ${
                      isProjectActive
                        ? "bg-space-700 text-white font-medium"
                        : "text-gray-400 hover:text-white"
                    }`;
                  }}
                >
                  {item}
                </NavLink>
              );
            })}

            {/* Mobile Showreel button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowreelOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] border border-white cursor-pointer mt-2"
            >
              <Play size={16} className="fill-current" />
              <span>Watch Showreel</span>
            </button>
          </div>
        )}
      </header>

      {/* Shared Dynamic Cinema Lightbox Modal */}
      <CinemaModal
        video={showreelOpen ? SHOWREEL_VIDEO : null}
        onClose={() => setShowreelOpen(false)}
      />
    </>
  );
};

export default Navbar;