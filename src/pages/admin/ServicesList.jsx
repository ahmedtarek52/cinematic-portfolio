import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllServices, createService, updateService, deleteService } from "../../services/services-catalog";
import { useToast } from "../../components/admin/Toast";
import DataTable from "../../components/admin/DataTable";
import ConfirmDeleteDialog from "../../components/admin/ConfirmDeleteDialog";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";

const ServicesList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editing, setEditing] = useState(null); // null | "new" | service object

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getAllServices,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted");
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => data._isNew ? createService(data) : updateService(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service saved!");
      setEditing(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "description", label: "Description", render: (r) => <span className="text-gray-400 text-xs truncate block max-w-xs">{r.description}</span> },
    { key: "sortOrder", label: "Order", sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Studio service offerings</p>
        </div>
        <button onClick={() => setEditing({ _isNew: true, id: "", title: "", description: "", icon: "", details: [], sortOrder: 0 })} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-blue-600 transition">
          <Plus className="w-4 h-4" />New Service
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 bg-space-800 rounded-xl animate-pulse" />
      ) : (
        <DataTable columns={columns} data={services} searchable searchKeys={["title", "description"]} emptyMessage="No services yet."
          actions={(row) => (
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); setEditing(row); }} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-space-700 transition"><Edit className="w-4 h-4" /></button>
              <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        />
      )}

      {/* Inline Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative bg-space-800 border border-[#2a2a2a] rounded-2xl p-6 max-w-lg w-full mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{editing._isNew ? "New Service" : "Edit Service"}</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); saveMutation.mutate({ ...editing, id: editing._isNew ? fd.get("id") : editing.id, title: fd.get("title"), description: fd.get("description"), icon: fd.get("icon"), sortOrder: Number(fd.get("sortOrder") || 0) }); }}>
              {editing._isNew && <div><label className="block text-sm font-medium text-gray-300 mb-1">ID (slug)</label><input name="id" defaultValue="" required className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>}
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Title</label><input name="title" defaultValue={editing.title} required className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Description</label><textarea name="description" defaultValue={editing.description} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Icon</label><input name="icon" defaultValue={editing.icon} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Sort Order</label><input name="sortOrder" type="number" defaultValue={editing.sortOrder} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-space-700 text-gray-300 text-sm font-medium border border-[#2a2a2a]">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-50">
                  {saveMutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget?.id)} isLoading={deleteMutation.isPending} title="Delete Service" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
};

export default ServicesList;
