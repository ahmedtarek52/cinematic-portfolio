import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project.id}`}>
      <div className="rounded-xl overflow-hidden shadow hover:scale-105 transition bg-white">
        <img src={project.thumbnail} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold">{project.title}</h3>
          <p className="text-gray-500 text-sm">{project.category}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
