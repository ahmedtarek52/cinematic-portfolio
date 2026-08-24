import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProjects, deleteProject } from "../../services/projects";
import { useToast } from "../../components/admin/Toast";
import DataTable from "../../components/admin/DataTable";
import ConfirmDeleteDialog from "../../components/admin/ConfirmDeleteDialog";
import { Plus, Edit, Trash2, Film } from "lucide-react";
import { getOptimizedUrl } from "../../lib/cloudinary";

const ProjectsList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Project deleted successfully");
      setDeleteTarget(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete project");
    },
  });

  const columns = [
    {
      key: "thumbnail",
      label: "",
      render: (row) =>
        row.thumbnail ? (
          <img
            src={getOptimizedUrl(row.thumbnail, { width: 150 })}
            alt={row.title}
            className="w-12 h-8 object-cover rounded bg-space-900"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              if (row.thumbnail && e.currentTarget.src !== row.thumbnail) {
                e.currentTarget.src = row.thumbnail;
                return;
              }
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-12 h-8 bg-space-700 rounded flex items-center justify-center text-gray-500">
            <Film className="w-3.5 h-3.5" />
          </div>
        ),
    },
    { key: "title", label: "Title", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "year", label: "Year", sortable: true },
    { key: "type", label: "Type", sortable: true },
    {
      key: "services",
      label: "Services",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.services || []).slice(0, 2).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded text-[10px] bg-accent/15 text-accent"
            >
              {s}
            </span>
          ))}
          {(row.services || []).length > 2 && (
            <span className="text-gray-500 text-[10px]">
              +{row.services.length - 2}
            </span>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-space-700 rounded animate-pulse" />
        <div className="h-64 bg-space-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={projects}
        searchable
        searchKeys={["title", "category", "year", "type", "services"]}
        emptyMessage="No projects yet. Create your first project."
        actions={(row) => (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/projects/${row.id}/edit`);
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-space-700 transition"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(row);
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
        isLoading={deleteMutation.isPending}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ProjectsList;
