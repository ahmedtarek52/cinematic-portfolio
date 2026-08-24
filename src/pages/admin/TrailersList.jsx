import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTrailers, deleteTrailer } from "../../services/trailers";
import { useToast } from "../../components/admin/Toast";
import DataTable from "../../components/admin/DataTable";
import ConfirmDeleteDialog from "../../components/admin/ConfirmDeleteDialog";
import { Plus, Edit, Trash2, Film } from "lucide-react";
import { getOptimizedUrl } from "../../lib/cloudinary";

const TrailersList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: trailers = [], isLoading } = useQuery({
    queryKey: ["trailers"],
    queryFn: getAllTrailers,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTrailer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trailers"] });
      queryClient.invalidateQueries({ queryKey: ["trailer"] });
      toast.success("Trailer deleted successfully");
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.message || "Failed to delete trailer"),
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
            className="w-16 h-10 object-cover rounded bg-space-900"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              if (row.thumbnail && e.currentTarget.src !== row.thumbnail) {
                e.currentTarget.src = row.thumbnail;
                return;
              }
              if (row.vimeoId && !e.currentTarget.src.includes("vumbnail.com")) {
                e.currentTarget.src = `https://vumbnail.com/${row.vimeoId}.jpg`;
                return;
              }
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-16 h-10 bg-space-700 rounded flex items-center justify-center text-gray-500">
            <Film className="w-4 h-4" />
          </div>
        ),
    },
    { key: "title", label: "Title", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "year", label: "Year", sortable: true },
    { key: "duration", label: "Duration" },
    { key: "genre", label: "Genre" },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trailers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage trailer entries</p>
        </div>
        <Link
          to="/admin/trailers/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" />
          New Trailer
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={trailers}
        searchable
        searchKeys={["title", "category", "year", "genre"]}
        emptyMessage="No trailers yet."
        actions={(row) => (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/admin/trailers/${row.id}/edit`); }}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-space-700 transition"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
        isLoading={deleteMutation.isPending}
        title="Delete Trailer"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default TrailersList;
