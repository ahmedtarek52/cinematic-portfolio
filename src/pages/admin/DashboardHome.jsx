import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Film,
  Clapperboard,
  MessageSquare,
  Briefcase,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { getAllProjects } from "../../services/projects";
import { getAllTrailers } from "../../services/trailers";
import { getContactMessages } from "../../services/contact";
import { getAllServices } from "../../services/services-catalog";
import { getAllCareers } from "../../services/careers";

const StatCard = ({ icon: Icon, label, count, to, color }) => (
  <Link
    to={to}
    className="group p-5 rounded-2xl bg-space-800 border border-border hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/5"
  >
    <div className="flex items-center justify-between">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-accent transition" />
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-white">{count ?? "—"}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  </Link>
);

const DashboardHome = () => {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });
  const { data: trailers } = useQuery({
    queryKey: ["trailers"],
    queryFn: getAllTrailers,
  });
  const { data: messages } = useQuery({
    queryKey: ["contactMessages"],
    queryFn: getContactMessages,
  });
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getAllServices,
  });
  const { data: careers } = useQuery({
    queryKey: ["careers"],
    queryFn: getAllCareers,
  });

  const unreadMessages = messages?.filter((m) => !m.read)?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Overview of your portfolio content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          icon={Film}
          label="Projects"
          count={projects?.length}
          to="/admin/projects"
          color="bg-space-700 text-zinc-200"
        />
        <StatCard
          icon={Clapperboard}
          label="Trailers"
          count={trailers?.length}
          to="/admin/trailers"
          color="bg-space-700 text-zinc-300"
        />
        <StatCard
          icon={Briefcase}
          label="Services"
          count={services?.length}
          to="/admin/services"
          color="bg-space-700 text-zinc-200"
        />
        <StatCard
          icon={GraduationCap}
          label="Careers"
          count={careers?.length}
          to="/admin/careers"
          color="bg-space-700 text-zinc-300"
        />
        <StatCard
          icon={MessageSquare}
          label="Unread Messages"
          count={unreadMessages}
          to="/admin/messages"
          color="bg-space-700 text-zinc-100"
        />
      </div>

      {/* Recent Messages */}
      {messages && messages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Messages</h2>
            <Link
              to="/admin/messages"
              className="text-accent text-sm hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {messages.slice(0, 5).map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border transition ${
                  msg.read
                    ? "bg-space-800/50 border-border"
                    : "bg-space-800 border-accent/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium text-sm">
                        {msg.firstName} {msg.lastName}
                      </p>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-accent" />
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">{msg.email}</p>
                    <p className="text-gray-400 text-sm mt-1 truncate">
                      {msg.message}
                    </p>
                  </div>
                  <p className="text-gray-600 text-xs whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
