import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getProjectById,
  createProject,
  updateProject,
} from "../../services/projects";
import { useToast } from "../../components/admin/Toast";
import CloudinaryUploader from "../../components/admin/CloudinaryUploader";
import MultiImageUploader from "../../components/admin/MultiImageUploader";
import TagInput from "../../components/admin/TagInput";
import RepeatingFieldGroup from "../../components/admin/RepeatingFieldGroup";
import { ArrowLeft, Save } from "lucide-react";

const projectSchema = z.object({
  id: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  year: z.string().min(1, "Year is required"),
  type: z.string().min(1, "Type is required"),
  heroImage: z.string().min(1, "Hero image is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  description: z.string().min(1, "Description is required"),
  services: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  metadata: z.string().optional().default(""),
  overview: z.string().optional().default(""),
  approach: z.string().optional().default(""),
  stills: z.array(z.string()).default([]),
  credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
  techSpecs: z.object({
    master: z.string().optional().default(""),
    colorSpace: z.string().optional().default(""),
    hdr: z.string().optional().default(""),
    pipeline: z.string().optional().default(""),
  }).default({}),
  vimeo: z.string().nullable().optional().default(null),
  sortOrder: z.number().optional().default(0),
});

const ProjectForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: existingProject, isLoading: loadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: "",
      title: "",
      category: "",
      year: new Date().getFullYear().toString(),
      type: "",
      heroImage: "",
      thumbnail: "",
      description: "",
      services: [],
      tags: [],
      metadata: "",
      overview: "",
      approach: "",
      stills: [],
      credits: [],
      techSpecs: { master: "", colorSpace: "", hdr: "", pipeline: "" },
      vimeo: "",
      sortOrder: 0,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existingProject) {
      reset({
        ...existingProject,
        vimeo: existingProject.vimeo || "",
        sortOrder: existingProject.sortOrder || 0,
        techSpecs: {
          master: existingProject.techSpecs?.master || "",
          colorSpace: existingProject.techSpecs?.colorSpace || "",
          hdr: existingProject.techSpecs?.hdr || "",
          pipeline: existingProject.techSpecs?.pipeline || "",
        },
      });
    }
  }, [existingProject, reset]);

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        vimeo: data.vimeo || null,
        metadata: data.metadata || `${data.year} • ${data.type} • ${data.services.join(", ")}`,
      };
      return isEditing
        ? updateProject(id, payload)
        : createProject(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["project", id] });
      }
      toast.success(isEditing ? "Project updated!" : "Project created!");
      navigate("/admin/projects");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save project");
    },
  });

  if (isEditing && loadingProject) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-space-700 rounded animate-pulse" />
        <div className="h-96 bg-space-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/projects")}
          className="p-2 rounded-lg bg-space-800 text-gray-400 hover:text-white border border-border transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? "Edit Project" : "New Project"}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEditing
              ? `Editing "${existingProject?.title}"`
              : "Create a new portfolio project"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-8"
      >
        {/* Basic Info */}
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Slug (ID) {isEditing && <span className="text-gray-600">(read-only)</span>}
              </label>
              <input
                {...register("id")}
                readOnly={isEditing}
                className={`w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition ${isEditing ? "opacity-60" : ""}`}
                placeholder="e.g. nocturne"
              />
              {errors.id && (
                <p className="text-red-400 text-xs mt-1">{errors.id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                {...register("title")}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
                placeholder="Project title"
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
              >
                <option value="">Select category...</option>
                <option value="TCP">TCP</option>
                <option value="Cinema">Cinema</option>
                <option value="Drama">Drama</option>
                {existingProject?.category &&
                  !["TCP", "Cinema", "Drama"].some(
                    (c) => c.toLowerCase() === existingProject.category.toLowerCase()
                  ) && (
                    <option value={existingProject.category}>
                      {existingProject.category}
                    </option>
                  )}
              </select>
              {errors.category && (
                <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Year
              </label>
              <input
                {...register("year")}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
                placeholder="2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Type
              </label>
              <input
                {...register("type")}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
                placeholder="Commercial, Narrative, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Images</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Controller
              name="heroImage"
              control={control}
              render={({ field }) => (
                <CloudinaryUploader
                  label="Hero Image"
                  value={field.value}
                  onChange={field.onChange}
                  folder="portfolio/projects"
                />
              )}
            />
            <Controller
              name="thumbnail"
              control={control}
              render={({ field }) => (
                <CloudinaryUploader
                  label="Thumbnail"
                  value={field.value}
                  onChange={field.onChange}
                  folder="portfolio/projects"
                />
              )}
            />
          </div>
          {(errors.heroImage || errors.thumbnail) && (
            <p className="text-red-400 text-xs">
              {errors.heroImage?.message || errors.thumbnail?.message}
            </p>
          )}

          <Controller
            name="stills"
            control={control}
            render={({ field }) => (
              <MultiImageUploader
                label="Stills Gallery"
                value={field.value}
                onChange={field.onChange}
                folder="portfolio/projects/stills"
              />
            )}
          />
        </section>

        {/* Content */}
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Content</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition resize-none"
              placeholder="Brief project description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Overview
            </label>
            <textarea
              {...register("overview")}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition resize-none"
              placeholder="Detailed project overview..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Approach
            </label>
            <textarea
              {...register("approach")}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition resize-none"
              placeholder="Technical approach and methodology..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Vimeo URL (optional)
            </label>
            <input
              {...register("vimeo")}
              className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
              placeholder="https://vimeo.com/..."
            />
          </div>
        </section>

        {/* Tags & Services */}
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Tags & Services</h2>

          <Controller
            name="services"
            control={control}
            render={({ field }) => (
              <TagInput
                label="Services"
                value={field.value}
                onChange={field.onChange}
                placeholder="e.g. Color, HDR, Finish..."
              />
            )}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagInput
                label="Tags"
                value={field.value}
                onChange={field.onChange}
                placeholder="e.g. ACES, Dolby Vision..."
              />
            )}
          />
        </section>

        {/* Credits */}
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Credits</h2>

          <Controller
            name="credits"
            control={control}
            render={({ field }) => (
              <RepeatingFieldGroup
                value={field.value}
                onChange={field.onChange}
                addLabel="Add Credit"
                fields={[
                  { name: "role", label: "Role", type: "text", placeholder: "e.g. Director" },
                  { name: "name", label: "Name", type: "text", placeholder: "e.g. A. Rivera" },
                ]}
              />
            )}
          />
        </section>

        {/* Tech Specs */}
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-border">
          <h2 className="text-lg font-semibold text-white">Tech Specs</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Master Format
              </label>
              <input
                {...register("techSpecs.master")}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
                placeholder="e.g. 4K DCI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Color Space
              </label>
              <input
                {...register("techSpecs.colorSpace")}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
                placeholder="e.g. P3-D65"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                HDR
              </label>
              <input
                {...register("techSpecs.hdr")}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
                placeholder="e.g. Dolby V."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Pipeline
              </label>
              <input
                {...register("techSpecs.pipeline")}
                className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-border text-white text-sm focus:border-accent focus:outline-none transition"
                placeholder="e.g. ACES"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="px-6 py-2.5 rounded-xl bg-space-700 text-gray-300 text-sm font-medium hover:bg-space-600 transition border border-border"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition disabled:opacity-50"
          >
            {mutation.isPending ? (
              <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEditing ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
