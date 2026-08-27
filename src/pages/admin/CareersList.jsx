import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCareers, createCareer, updateCareer, deleteCareer } from "../../services/careers";
import { useToast } from "../../components/admin/Toast";
import DataTable from "../../components/admin/DataTable";
import ConfirmDeleteDialog from "../../components/admin/ConfirmDeleteDialog";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";

const CareersList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editing, setEditing] = useState(null);

  const { data: careers = [], isLoading } = useQuery({
    queryKey: ["careers"],
    queryFn: getAllCareers,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCareer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careers"] });
      toast.success("Career deleted");
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => data._isNew ? createCareer(data) : updateCareer(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careers"] });
      toast.success("Career saved!");
      setEditing(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "location", label: "Location" },
    { key: "type", label: "Type" },
    {
      key: "active", label: "Status",
      render: (r) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${r.active ? "bg-emerald-500/20 text-emerald-300" : "bg-gray-500/20 text-gray-400"}`}>
          {r.active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Careers</h1>
          <p className="text-gray-500 text-sm mt-1">Job openings</p>
        </div>
        <button onClick={() => setEditing({ _isNew: true, id: "", title: "", department: "", location: "", type: "", description: "", active: true, sortOrder: 0 })} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition">
          <Plus className="w-4 h-4" />New Position
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 bg-space-800 rounded-xl animate-pulse" />
      ) : (
        <DataTable columns={columns} data={careers} searchable searchKeys={["title", "department", "location"]} emptyMessage="No careers posted."
          actions={(row) => (
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); setEditing(row); }} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-space-700 transition"><Edit className="w-4 h-4" /></button>
              <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        />
      )}

      {editing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative bg-space-800 border border-border rounded-2xl p-6 max-w-lg w-full mx-4 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{editing._isNew ? "New Position" : "Edit Position"}</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); saveMutation.mutate({ ...editing, id: editing._isNew ? fd.get("id") : editing.id, title: fd.get("title"), department: fd.get("department"), location: fd.get("location"), type: fd.get("type"), description: fd.get("description"), active: fd.get("active") === "true", sortOrder: Number(fd.get("sortOrder") || 0) }); }}>
              {editing._isNew && <div><label className="block text-sm font-medium text-gray-300 mb-1">ID (slug)</label><input name="id" defaultValue="" required className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" /></div>}
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Title</label><input name="title" defaultValue={editing.title} required className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Department</label><input name="department" defaultValue={editing.department} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Location</label><input name="location" defaultValue={editing.location} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Type</label><input name="type" defaultValue={editing.type} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" placeholder="Full-time, Part-time..." /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Status</label><select name="active" defaultValue={String(editing.active)} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"><option value="true">Active</option><option value="false">Inactive</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Description</label><textarea name="description" defaultValue={editing.description} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition resize-none" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Sort Order</label><input name="sortOrder" type="number" defaultValue={editing.sortOrder} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-space-700 text-gray-300 text-sm font-medium border border-border">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition disabled:opacity-50">
                  {saveMutation.isPending ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget?.id)} isLoading={deleteMutation.isPending} title="Delete Position" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
};

export default CareersList;
