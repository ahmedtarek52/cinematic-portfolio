import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById, getRelatedProjects } from "../../services/projects";
import { ArrowLeft, Play } from "lucide-react";
import { getOptimizedUrl } from "../../lib/cloudinary";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });

  const { data: relatedProjects = [] } = useQuery({
    queryKey: ["relatedProjects", id],
    queryFn: () => getRelatedProjects(id, 2),
    enabled: !!id,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="relative rounded-xl overflow-hidden">
          <div className="h-[500px] md:h-[600px] bg-space-700 animate-pulse" />
        </div>
        <div className="px-4 md:px-6 space-y-8">
          <div className="h-12 w-64 bg-space-700 rounded-lg animate-pulse" />
          <div className="h-6 w-96 bg-space-800 rounded-lg animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-space-800 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-space-800 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-space-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Project not found.</p>
        <Link
          to="/projects"
          className="text-accent hover:underline mt-4 inline-block"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero div */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img
            src={getOptimizedUrl(project.heroImage, { width: 1920 })}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-6 left-6">
            <span className="bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg">
              {project.title}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-6">
        {/* Title and Metadata */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {project.title}
            </h1>
            <p className="text-gray-400 text-lg">{project.metadata}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/projects")}
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

        {/* Overview div */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Overview</h2>
          <p className="text-gray-400 leading-relaxed text-lg">
            {project.overview}
          </p>
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
        </div>

        {/* Approach div */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Approach</h2>
          <p className="text-gray-400 leading-relaxed text-lg">
            {project.approach}
          </p>
        </div>

        {/* Stills div */}
        {project.stills && project.stills.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Stills
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 grid-flow-dense">
              {project.stills.map((still, index) => {
                const getSpanClass = (i) => {
                  const pattern = i % 10;
                  switch (pattern) {
                    case 0:
                      return "md:col-span-2 md:row-span-1";
                    case 3:
                      return "md:col-span-1 md:row-span-2";
                    case 4:
                      return "md:col-span-2 md:row-span-2";
                    case 5:
                      return "md:col-span-3 md:row-span-2";
                    case 9:
                      return "md:col-span-2 md:row-span-1";
                    default:
                      return "md:col-span-1 md:row-span-1";
                  }
                };

                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden group cursor-pointer rounded-sm md:rounded-md bg-zinc-900 ${getSpanClass(index)}`}
                    style={{ minHeight: "200px" }}
                  >
                    <img
                      src={getOptimizedUrl(still, { width: 1200 })}
                      alt={`${project.title} still ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tech Specs div */}
        {project.techSpecs && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Tech Specs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-space-800 border border-[#2a2a2a] rounded-lg p-4">
                <div className="text-white font-bold text-xl mb-1">
                  {project.techSpecs.master}
                </div>
                <div className="text-gray-400 text-sm">Master</div>
              </div>
              <div className="bg-space-800 border border-[#2a2a2a] rounded-lg p-4">
                <div className="text-white font-bold text-xl mb-1">
                  {project.techSpecs.colorSpace}
                </div>
                <div className="text-gray-400 text-sm">Color Space</div>
              </div>
              <div className="bg-space-800 border border-[#2a2a2a] rounded-lg p-4">
                <div className="text-white font-bold text-xl mb-1">
                  {project.techSpecs.hdr}
                </div>
                <div className="text-gray-400 text-sm">HDR</div>
              </div>
              <div className="bg-space-800 border border-[#2a2a2a] rounded-lg p-4">
                <div className="text-white font-bold text-xl mb-1">
                  {project.techSpecs.pipeline}
                </div>
                <div className="text-gray-400 text-sm">Pipeline</div>
              </div>
            </div>
          </div>
        )}

        {/* Related Projects div */}
        {relatedProjects.length > 0 && (
          <div className="space-y-4">
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
                        src={getOptimizedUrl(relatedProject.thumbnail, { width: 800 })}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-4 bg-space-700">
                      <h3 className="text-white font-semibold text-lg">
                        {relatedProject.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
