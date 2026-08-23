import { Link } from "react-router-dom";
import { getOptimizedUrl } from "../../lib/cloudinary";

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project.id}`} className="h-full">
      <div className="rounded-xl overflow-hidden shadow hover:scale-105 transition bg-white h-full flex flex-col">
        <img
          src={getOptimizedUrl(project.thumbnail, { width: 800 })}
          alt={project.title}
          className="w-full h-40 object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="p-4 flex-grow">
          <h3 className="font-semibold">{project.title}</h3>
          <p className="text-gray-500 text-sm">{project.category}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;