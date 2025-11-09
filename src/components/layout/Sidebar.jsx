import { NavLink, useLocation } from "react-router-dom";
import { Home, Film, Briefcase, Info, Users, Phone } from "lucide-react";
import { projects } from "../../data/projects";

const navItems = [
  { title: "Home", icon: <Home size={18} />, path: "/" },
  { title: "Projects", icon: <Film size={18} />, path: "/projects" },
  { title: "Services", icon: <Briefcase size={18} />, path: "/services" },
  { title: "About", icon: <Info size={18} />, path: "/about" },
  { title: "Careers", icon: <Users size={18} />, path: "/careers" },
  { title: "Contact", icon: <Phone size={18} />, path: "/contact" },
];

const Sidebar = () => {
  const location = useLocation();
  const isProjectPage = location.pathname.startsWith('/projects');
  
  // Get current project if on project details page
  const projectId = location.pathname.split('/projects/')[1];
  const currentProject = projectId ? projects.find(p => p.id === projectId) : null;

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 bg-space-900 rounded-xl p-6 sticky top-0 h-fit">
      
      <div className="space-y-8">
        {/* Navigate Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
            Navigate
          </h3>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isProjects = item.path === "/projects";
              
              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={({ isActive }) => {
                    const isItemActive = isProjects 
                      ? (isActive || isProjectPage)
                      : isActive;
                    
                    return `flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition
                     ${
                       isItemActive
                         ? "bg-space-700 text-white"
                         : "text-gray-400 hover:bg-space-800 hover:text-white"
                     }`;
                  }}
                >
                  {item.icon}
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Project Section - Show only on project details page */}
        {currentProject && (
          <div>
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
              Project
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 text-sm bg-space-800 px-3 py-1.5 rounded-lg border border-[#2a2a2a]">
                {currentProject.type || currentProject.category}
              </span>
              <span className="text-gray-400 text-sm bg-space-800 px-3 py-1.5 rounded-lg border border-[#2a2a2a]">
                {currentProject.year}
              </span>
              {currentProject.services.slice(0, 2).map((service) => (
                <span 
                  key={service}
                  className="text-gray-400 text-sm bg-space-800 px-3 py-1.5 rounded-lg border border-[#2a2a2a]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="text-gray-400 text-sm space-y-1 mt-8">
        <p>inquiries@spectrapost.com</p>
        <p>+1 (555) 123-4567</p>
      </div>
    </aside>
  );
};

export default Sidebar;
