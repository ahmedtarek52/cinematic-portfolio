import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Film, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../services/projects";
import ProjectCard from "./ProjectCard";

const CATEGORIES = ["All", "TVC", "Cinema", "Drama"];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState({});
  const projectsPerPage = 9;

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  // Scroll to top on page enter
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset page when filtering or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (p.category || "").trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase();

      const matchesSearch =
        searchQuery.trim() === "" ||
        (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.year || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (p.services || []).some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (p.tags || []).some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, projects]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice(
      (currentPage - 1) * projectsPerPage,
      currentPage * projectsPerPage
    );
  }, [filteredProjects, currentPage, projectsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = document.querySelectorAll(".project-card-animate");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [currentPage, paginatedProjects]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen py-24 px-4 md:px-6 space-y-12 relative">
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-700/10 blur-[160px] pointer-events-none rounded-full" />
        <div className="relative text-center space-y-4 pt-6">
          <div className="h-12 w-80 mx-auto bg-space-700 rounded-lg animate-pulse" />
          <div className="h-6 w-96 mx-auto bg-space-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-space-800 rounded-xl animate-pulse border border-border"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">Failed to load projects</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 md:px-6 space-y-12 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-700/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Page Header */}
      <div className="relative text-center space-y-4 pt-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
        >
          Featured{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
            Projects
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Browse our complete portfolio of finished commercial, narrative,
          documentary, and music video projects engineered with precision color
          grading.
        </motion.p>

        {/* Filters & Search Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 max-w-5xl mx-auto"
        >
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? projects.length
                  : projects.filter(
                      (p) =>
                        (p.category || "").trim().toLowerCase() ===
                        cat.trim().toLowerCase()
                    ).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950 font-bold border border-white shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                      : "bg-space-800/90 text-zinc-400 hover:text-white border border-border hover:border-zinc-500"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-zinc-900 text-zinc-200"
                        : "bg-space-700 text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-space-800/90 text-sm text-white placeholder-gray-500 border border-border focus:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Empty State */}
      {paginatedProjects.length === 0 ? (
        <div className="text-center py-20 bg-space-800/30 rounded-2xl border border-border relative z-10 max-w-xl mx-auto">
          <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">
            No Projects Found
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {searchQuery
              ? `No projects found matching "${searchQuery}".`
              : "No projects found in this category."}{" "}
            Try selecting a different category or clearing your search.
          </p>
          {(selectedCategory !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-6 px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 text-xs font-semibold hover:bg-white transition cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Projects Grid with Slide-in Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {paginatedProjects.map((project, index) => (
              <div
                key={project.id}
                id={`project-${project.id}-${currentPage}`}
                className={`project-card-animate h-full transition-all duration-700 ease-out ${
                  isVisible[`project-${project.id}-${currentPage}`]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 relative z-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-space-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-space-700 transition border border-border text-xs font-semibold cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      currentPage === page
                        ? "bg-zinc-100 text-zinc-950 font-bold border border-white shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                        : "bg-space-800 text-zinc-400 hover:text-white border border-border hover:border-zinc-500"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-space-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-space-700 transition border border-border text-xs font-semibold cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;