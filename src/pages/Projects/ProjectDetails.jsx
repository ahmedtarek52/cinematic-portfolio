import { useParams, Link, useNavigate } from "react-router-dom";
import { projects, getRelatedProjects } from "../../data/projects";
import { ArrowLeft, Play } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  const relatedProjects = getRelatedProjects(id, 2);

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Project not found.</p>
        <Link to="/projects" className="text-accent hover:underline mt-4 inline-block">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img 
            src={project.heroImage} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-6 left-6">
            <span className="bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg">
              {project.title}
            </span>
          </div>
        </div>
      </div>

      {/* Title and Metadata */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{project.title}</h1>
          <p className="text-gray-400 text-lg">{project.metadata}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 bg-space-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-space-600 transition border border-[#2a2a2a]"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </button>
          {project.vimeo && (
            <button className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition">
              <Play size={18} />
              Play Case Study
            </button>
          )}
        </div>
      </div>

      {/* Overview Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Overview</h2>
        <p className="text-gray-400 leading-relaxed text-lg">{project.overview}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-gray-400 text-sm bg-space-800 px-3 py-1.5 rounded-lg border border-[#2a2a2a]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Approach Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Approach</h2>
        <p className="text-gray-400 leading-relaxed text-lg">{project.approach}</p>
      </section>

      {/* Stills Section */}
      {project.stills && project.stills.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Stills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.stills.map((still, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
              >
                <img 
                  src={still} 
                  alt={`${project.title} still ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Credits Section */}
      {project.credits && project.credits.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Credits</h2>
          <div className="space-y-0 border border-[#2a2a2a] rounded-lg overflow-hidden bg-space-800">
            {project.credits.map((credit, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between px-6 py-4 ${
                  index !== project.credits.length - 1 ? 'border-b border-[#2a2a2a]' : ''
                }`}
              >
                <span className="text-gray-400">{credit.role}</span>
                <span className="text-white font-medium">{credit.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tech Specs Section */}
      {project.techSpecs && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Tech Specs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-space-800 border border-[#2a2a2a] rounded-lg p-4">
              <div className="text-white font-bold text-xl mb-1">{project.techSpecs.master}</div>
              <div className="text-gray-400 text-sm">Master</div>
            </div>
            <div className="bg-space-800 border border-[#2a2a2a] rounded-lg p-4">
              <div className="text-white font-bold text-xl mb-1">{project.techSpecs.colorSpace}</div>
              <div className="text-gray-400 text-sm">Color Space</div>
            </div>
            <div className="bg-space-800 border border-[#2a2a2a] rounded-lg p-4">
              <div className="text-white font-bold text-xl mb-1">{project.techSpecs.hdr}</div>
              <div className="text-gray-400 text-sm">HDR</div>
            </div>
            <div className="bg-space-800 border border-[#2a2a2a] rounded-lg p-4">
              <div className="text-white font-bold text-xl mb-1">{project.techSpecs.pipeline}</div>
              <div className="text-gray-400 text-sm">Pipeline</div>
            </div>
          </div>
        </section>
      )}

      {/* Related Projects Section */}
      {relatedProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProjects.map((relatedProject) => (
              <Link 
                key={relatedProject.id} 
                to={`/projects/${relatedProject.id}`}
                className="group"
              >
                <div className="relative rounded-xl overflow-hidden bg-space-700 hover:scale-[1.02] transition-transform duration-300 cursor-pointer border border-[#2a2a2a]">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={relatedProject.thumbnail} 
                      alt={relatedProject.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-4 bg-space-700">
                    <h3 className="text-white font-semibold text-lg">{relatedProject.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectDetails;
