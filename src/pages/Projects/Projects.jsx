import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  const ProjectCard = ({ project }) => (
    <Link to={`/projects/${project.id}`}>
      <div className="group relative rounded-xl overflow-hidden bg-space-700 hover:scale-[1.02] transition-transform duration-300 cursor-pointer border border-[#2a2a2a]">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={project.thumbnail} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
              {project.category}
            </span>
          </div>
        </div>
        <div className="p-4 bg-space-700">
          <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
          <div className="flex gap-2 flex-wrap">
            {project.services.map((service) => (
              <span key={service} className="text-gray-400 text-xs bg-space-800 px-2 py-1 rounded-md border border-[#2a2a2a]">
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
        <p className="text-gray-400 text-sm">Browse our catalog of finished work</p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
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
