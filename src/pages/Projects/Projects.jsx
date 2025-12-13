import React, { useState, useEffect } from 'react';
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
            setIsVisible(prev => ({
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
    <div className="space-y-8 py-20 max-w-7xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="mb-8">
        {/* <h1 className="text-4xl font-bold text-white mb-2">Projects</h1> */}
        <p className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl">Browse our catalog of finished work</p>
      </div>

      {/* Projects Grid with Slide-in Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((project, index) => (
          <div
            key={project.id}
            id={`project-${project.id}-${currentPage}`}
            className={`project-card-animate transition-all duration-700 ease-out ${
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
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-space-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-space-600 transition border border-[#2a2a2a]"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === page
                  ? 'bg-accent text-white'
                  : 'bg-space-700 text-gray-400 hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-space-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-space-600 transition border border-[#2a2a2a]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;