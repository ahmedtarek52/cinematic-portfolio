import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../../data/projects';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState({});
  const projectsPerPage = 9;

  // Pagination
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('.project-card-animate');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [currentPage]);

  return (
    <div className="min-h-screen py-24 px-4 md:px-6 space-y-12 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Page Header */}
      <div className="relative text-center space-y-4 pt-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
        >
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">Projects</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Browse our complete portfolio of finished commercial, narrative, documentary, and music video projects engineered with precision color grading.
        </motion.p>
      </div>

      {/* Projects Grid with Slide-in Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {paginatedProjects.map((project, index) => (
          <div
            key={project.id}
            id={`project-${project.id}-${currentPage}`}
            className={`project-card-animate h-full transition-all duration-700 ease-out ${
              isVisible[`project-${project.id}-${currentPage}`]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
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
            className="px-4 py-2 rounded-xl bg-space-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-space-700 transition border border-[#2a2a2a] text-xs font-semibold cursor-pointer"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                currentPage === page
                  ? 'bg-accent text-white shadow-[0_0_20px_rgba(0,68,255,0.4)]'
                  : 'bg-space-800 text-gray-400 hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-space-800 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-space-700 transition border border-[#2a2a2a] text-xs font-semibold cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;