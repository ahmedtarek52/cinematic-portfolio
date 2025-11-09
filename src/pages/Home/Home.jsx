import React from 'react';
import { Film, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project.id}`}>
    <div className="group relative rounded-lg overflow-hidden bg-space-700 hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
            {project.category}
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">{project.title}</h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              {project.services.map((service) => (
                <span key={service} className="text-gray-300 text-xs bg-space-800/50 px-2 py-0.5 rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
);


const Home = () => {
  return (
<>
        
        {/* Hero Section */}
        <section className="grid gap-8 items-start bg-space-700 text-red rounded-2xl overflow-hidden shadow-2xl" role="banner">
          {/* Hero Image - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden  group">
              <img 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop" 
                alt="Professional color grading studio with ambient lighting"
                className="w-full h-[400px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4 p-5 ">
              <div>
                <h1 className=" text-2xl font-bold leading-tight">
                  Cinematic Color. Precise Finishing.
                </h1>
                <p className="text-gray-400 ">
                  Film post-production studio specializing in color grading, editorial, and finishing.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/projects" className="inline-flex items-center gap-2 bg-space-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-space-900 transition-colors duration-200 border border-[#2a2a2a]">
                  <Film size={20} />
                  View Projects
                </Link>
                <Link to="/showreel" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200">
                  <Play size={20} />
                  Watch Showreel
                </Link>
              </div>
            </div>
          </div>
        </section>


                      {/* Featured Works */}
        <section aria-labelledby="featured-works" className="mt-12 bg-space-700 text-red rounded-2xl overflow-hidden shadow-2xl p-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 id="featured-works" className="text-3xl font-bold mb-2">Featured Work</h2>
              <p className="text-gray-400 text-sm">
                Recent projects across narrative, commercial, and music video.
              </p>
            </div>
          <Link
            to="/projects"
            className="flex items-center gap-2 bg-space-700 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-space-800 transition border border-[#2a2a2a]"
          >
            <Play size={16} />
            See all projects
          </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>


   </>
  );
};

export default Home;