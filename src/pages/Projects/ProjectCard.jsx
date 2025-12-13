import React from 'react'
import { Link } from 'react-router-dom';
const ProjectCard = ({ project }) => {
  return (
        <Link to={`/projects/${project.id}`}>
      <div className="group relative   ">
        <div className="relative overflow-hidden hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
          <img 
            src={project.thumbnail} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* <div className="absolute top-3 left-3">
            <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
              {project.category}
            </span>
          </div> */}
        </div>
        <div className="py-5">
          <h3 className="text-white font-bold text-lg mb-2 hover:text-accent transition-colors duration-300">{project.title}</h3>
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
  )
}

export default ProjectCard