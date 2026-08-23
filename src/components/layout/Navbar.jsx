import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Play, Menu, X } from "lucide-react"; // Hamburger & close icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    <header 
      className={`w-full px-6 py-3 fixed top-0 z-50 transition-all duration-300 ${
        isHomePage 
          ? scrolled 
            ? "bg-black/80 backdrop-blur-md border-b border-gray-800" 
            : "bg-transparent"
          : "bg-black/80 backdrop-blur-md  border-b border-gray-800"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-white tracking-wide flex-shrink-0">
          ABO HUSSAIN
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-5 font-semibold ml-auto text-sm items-center">
          {navItems.map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isProjects = item === "Projects";
            const isProjectPage = location.pathname.startsWith('/projects');
            
            return (
              <NavLink
                key={item}
                to={path}
                className={({ isActive }) => {
                  // For Projects, also check if we're on a project details page
                  const isProjectActive = isProjects 
                    ? (isActive || isProjectPage)
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
          <Link
            to="/showreel"
            className="flex items-center gap-2 bg-gradient-to-br from-[#1488CC] to-[#2B32B2] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
          >
            <Play size={16} />
            Showreel
          </Link>
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
            const isProjectPage = location.pathname.startsWith('/projects');
            
            return (
              <NavLink
                key={item}
                to={path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => {
                  // For Projects, also check if we're on a project details page
                  const isProjectActive = isProjects 
                    ? (isActive || isProjectPage)
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

          {/* Showreel button inside mobile menu */}
          {/* <Link
            to="/showreel"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
          >
            <Play size={16} />
            Showreel
          </Link> */}
        </div>
      )}
    </header>
  );
};

export default Navbar;