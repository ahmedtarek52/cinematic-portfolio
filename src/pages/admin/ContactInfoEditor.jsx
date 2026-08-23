import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getContactInfo, updateContactInfo } from "../../services/contact";
import { useToast } from "../../components/admin/Toast";
import { Save } from "lucide-react";

const ContactInfoEditor = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: contactInfo, isLoading } = useQuery({
    queryKey: ["contactInfo"],
    queryFn: getContactInfo,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      heading: "", title: "", email: "", kakao: "",
      residing: { country: "", city: "" },
      stateHome: { country: "", city: "" },
      social: { instagram: "", vimeo: "", linkedin: "", twitter: "" },
    },
  });

  useEffect(() => {
    if (contactInfo) {
      reset({
        heading: contactInfo.heading || "",
        title: contactInfo.title || "",
        email: contactInfo.email || "",
        kakao: contactInfo.kakao || "",
        residing: {
          country: contactInfo.residing?.country || "",
          city: contactInfo.residing?.city || "",
        },
        stateHome: {
          country: contactInfo.stateHome?.country || "",
          city: contactInfo.stateHome?.city || "",
        },
        social: {
          instagram: contactInfo.social?.instagram || "",
          vimeo: contactInfo.social?.vimeo || "",
          linkedin: contactInfo.social?.linkedin || "",
          twitter: contactInfo.social?.twitter || "",
        },
      });
    }
  }, [contactInfo, reset]);

  const mutation = useMutation({
    mutationFn: updateContactInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactInfo"] });
      toast.success("Contact info updated!");
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="h-96 bg-space-800 rounded-xl animate-pulse" />;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Info</h1>
        <p className="text-gray-500 text-sm mt-1">Studio contact information displayed on the public site</p>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white">General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Heading</label><input {...register("heading")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Title</label><input {...register("title")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Email</label><input {...register("email")} type="email" className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Kakao</label><input {...register("kakao")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
          </div>
        </section>

        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white">Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Residing — Country</label><input {...register("residing.country")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Residing — City</label><input {...register("residing.city")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Home State — Country</label><input {...register("stateHome.country")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Home State — City</label><input {...register("stateHome.city")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
          </div>
        </section>

        <section className="space-y-4 p-6 rounded-2xl bg-space-800 border border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Instagram</label><input {...register("social.instagram")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Vimeo</label><input {...register("social.vimeo")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn</label><input {...register("social.linkedin")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Twitter / X</label><input {...register("social.twitter")} className="w-full px-4 py-2.5 rounded-xl bg-space-900 border border-[#2a2a2a] text-white text-sm focus:border-accent focus:outline-none transition" /></div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-50">
            {mutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInfoEditor;
