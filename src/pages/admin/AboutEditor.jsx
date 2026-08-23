import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getAboutContent, updateAboutContent } from "../../services/about";
import { useToast } from "../../components/admin/Toast";
import { Save } from "lucide-react";

const AboutEditor = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: getAboutContent,
  });

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
    defaultValues: {
      hero: { title: "", description: "", backgroundImage: "" },
      profile: { image: "", name: "", title: "", bio: "" },
      sections: [],
      skills: [],
    },
  });

  useEffect(() => {
    if (aboutContent) {
      reset({
        hero: {
          title: aboutContent.hero?.title || "",
          description: aboutContent.hero?.description || "",
          backgroundImage: aboutContent.hero?.backgroundImage || "",
        },
        profile: {
          image: aboutContent.profile?.image || "",
          name: aboutContent.profile?.name || "",
          title: aboutContent.profile?.title || "",
          bio: aboutContent.profile?.bio || "",
        },
        sections: aboutContent.sections || [],
        skills: aboutContent.skills || [],
      });
    }
  }, [aboutContent, reset]);

  const mutation = useMutation({
    mutationFn: updateAboutContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("About content updated!");
    },
    onError: (err) => toast.error(err.message || "Failed to save"),
  });

  if (isLoading) {
    return <div className="h-96 bg-space-800 rounded-xl animate-pulse" />;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">About Page</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the studio's about page content</p>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
        {/* Hero Section */}
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white">Hero Section</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input {...register("hero.title")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea {...register("hero.description")} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Background Image URL</label>
            <input {...register("hero.backgroundImage")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" />
          </div>
        </section>

        {/* Profile */}
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white">Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input {...register("profile.name")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title / Role</label>
              <input {...register("profile.title")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Profile Image URL</label>
            <input {...register("profile.image")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea {...register("profile.bio")} rows={5} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition resize-none" />
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-50">
            {mutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutEditor;
