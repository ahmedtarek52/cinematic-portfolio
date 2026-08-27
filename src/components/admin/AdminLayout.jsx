import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ToastProvider } from "./Toast";
import {
  LayoutDashboard,
  Film,
  Clapperboard,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  MessageSquare,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/projects", icon: Film, label: "Projects" },
  { to: "/admin/trailers", icon: Clapperboard, label: "Trailers" },
  { to: "/admin/about", icon: User, label: "About" },
  { to: "/admin/services", icon: Briefcase, label: "Services" },
  { to: "/admin/careers", icon: GraduationCap, label: "Careers" },
  { to: "/admin/contact", icon: Mail, label: "Contact Info" },
  { to: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-space-900 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-space-800 border-r border-border flex flex-col z-50">
          {/* Logo / Brand */}
          <div className="p-5 border-b border-border">
            <NavLink to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition text-xs mb-3">
              <ChevronLeft className="w-3 h-3" />
              Back to Site
            </NavLink>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Admin Panel
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">
              {user?.email}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/20"
                      : "text-gray-400 hover:text-white hover:bg-space-700/50"
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Sign Out */}
          <div className="p-3 border-t border-border">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 md:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;
