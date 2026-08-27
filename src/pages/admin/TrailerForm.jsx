import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getTrailerById, createTrailer, updateTrailer } from "../../services/trailers";
import { useToast } from "../../components/admin/Toast";
import CloudinaryUploader from "../../components/admin/CloudinaryUploader";
import TagInput from "../../components/admin/TagInput";
import { ArrowLeft, Save } from "lucide-react";

const trailerSchema = z.object({
  id: z.string().min(1, "Slug is required"),
  vimeoId: z.string().min(1, "Vimeo ID is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().default(""),
  year: z.string().optional().default(""),
  duration: z.string().optional().default(""),
  category: z.string().optional().default(""),
  filterCategory: z.string().optional().default(""),
  genre: z.string().optional().default(""),
  client: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  vimeoReviewUrl: z.string().optional().default(""),
  description: z.string().optional().default(""),
  specs: z.object({
    resolution: z.string().optional().default(""),
    colorSpace: z.string().optional().default(""),
    sound: z.string().optional().default(""),
    role: z.string().optional().default(""),
  }).default({}),
  tags: z.array(z.string()).default([]),
  sortOrder: z.number().optional().default(0),
});

const TrailerForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: existingTrailer, isLoading } = useQuery({
    queryKey: ["trailer", id],
    queryFn: () => getTrailerById(id),
    enabled: isEditing,
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(trailerSchema),
    defaultValues: {
      id: "", vimeoId: "", title: "", subtitle: "", year: "", duration: "",
      category: "", filterCategory: "", genre: "", client: "", thumbnail: "",
      vimeoReviewUrl: "", description: "",
      specs: { resolution: "", colorSpace: "", sound: "", role: "" },
      tags: [], sortOrder: 0,
    },
  });

  useEffect(() => {
    if (existingTrailer) {
      reset({
        ...existingTrailer,
        sortOrder: existingTrailer.sortOrder || 0,
        specs: {
          resolution: existingTrailer.specs?.resolution || "",
          colorSpace: existingTrailer.specs?.colorSpace || "",
          sound: existingTrailer.specs?.sound || "",
          role: existingTrailer.specs?.role || "",
        },
      });
    }
  }, [existingTrailer, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? updateTrailer(id, data) : createTrailer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trailers"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["trailer", id] });
      }
      toast.success(isEditing ? "Trailer updated!" : "Trailer created!");
      navigate("/admin/trailers");
    },
    onError: (err) => toast.error(err.message || "Failed to save trailer"),
  });

  if (isEditing && isLoading) {
    return <div className="h-96 bg-space-800 rounded-xl animate-pulse" />;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/admin/trailers")} className="p-2 rounded-lg bg-space-800 text-gray-400 hover:text-white border border-border transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{isEditing ? "Edit Trailer" : "New Trailer"}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Slug (ID)</label>
              <input {...register("id")} readOnly={isEditing} className={`w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition ${isEditing ? "opacity-60" : ""}`} placeholder="e.g. al-sofara" />
              {errors.id && <p className="text-red-400 text-xs mt-1">{errors.id.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input {...register("title")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Vimeo ID</label>
              <input {...register("vimeoId")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" placeholder="e.g. 811861466" />
              {errors.vimeoId && <p className="text-red-400 text-xs mt-1">{errors.vimeoId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label>
              <input {...register("subtitle")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
              <input {...register("year")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
              <input {...register("duration")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" placeholder="e.g. 02:26" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <input {...register("category")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Filter Category</label>
              <select {...register("filterCategory")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition">
                <option value="">Select...</option>
                <option value="Official Trailers">Official Trailers</option>
                <option value="Teasers & Spots">Teasers & Spots</option>
                <option value="Theatrical">Theatrical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
              <input {...register("genre")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Client</label>
              <input {...register("client")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Vimeo Review URL</label>
            <input {...register("vimeoReviewUrl")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea {...register("description")} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition resize-none" />
          </div>
        </section>

        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Thumbnail</h2>
          <Controller name="thumbnail" control={control} render={({ field }) => (
            <CloudinaryUploader label="Trailer Thumbnail" value={field.value} onChange={field.onChange} folder="portfolio/trailers" />
          )} />
        </section>

        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Specs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Resolution</label><input {...register("specs.resolution")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Color Space</label><input {...register("specs.colorSpace")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Sound</label><input {...register("specs.sound")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Role</label><input {...register("specs.role")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition" /></div>
          </div>
        </section>

        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Tags</h2>
          <Controller name="tags" control={control} render={({ field }) => (
            <TagInput value={field.value} onChange={field.onChange} placeholder="e.g. Official Teaser, Dolby Vision..." />
          )} />
        </section>

        <div className="flex items-center justify-end gap-4">
          <button type="button" onClick={() => navigate("/admin/trailers")} className="px-6 py-2.5 rounded-xl bg-space-700 text-gray-300 text-sm font-medium hover:bg-space-600 transition border border-border">Cancel</button>
          <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition disabled:opacity-50">
            {mutation.isPending ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? "Save Changes" : "Create Trailer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrailerForm;
