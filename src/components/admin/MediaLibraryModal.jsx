import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../services/projects";
import { getAllTrailers } from "../../services/trailers";
import { Search, X, Check, Image as ImageIcon } from "lucide-react";
import { getOptimizedUrl } from "../../lib/cloudinary";

/**
 * Media Library Modal
 * Allows selecting from already uploaded images across projects and trailers
 * to prevent duplicate uploads in Cloudinary.
 */
const MediaLibraryModal = ({ isOpen, onClose, onSelect, title = "Select from Media Library" }) => {
  const [search, setSearch] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  });

  const { data: trailers = [] } = useQuery({
    queryKey: ["trailers"],
    queryFn: getAllTrailers,
  });

  // Collect all unique image URLs with context tags
  const mediaItems = useMemo(() => {
    const map = new Map();

    // From projects
    projects.forEach((p) => {
      if (p.heroImage && p.heroImage.includes("cloudinary.com")) {
        if (!map.has(p.heroImage)) {
          map.set(p.heroImage, { url: p.heroImage, title: `${p.title} (Hero)`, project: p.title });
        }
      }
      if (p.thumbnail && p.thumbnail.includes("cloudinary.com")) {
        if (!map.has(p.thumbnail)) {
          map.set(p.thumbnail, { url: p.thumbnail, title: `${p.title} (Thumb)`, project: p.title });
        }
      }
      if (Array.isArray(p.stills)) {
        p.stills.forEach((s, idx) => {
          if (s && s.includes("cloudinary.com") && !map.has(s)) {
            map.set(s, { url: s, title: `${p.title} (Still #${idx + 1})`, project: p.title });
          }
        });
      }
    });

    // From trailers
    trailers.forEach((t) => {
      if (t.thumbnail && t.thumbnail.includes("cloudinary.com")) {
        if (!map.has(t.thumbnail)) {
          map.set(t.thumbnail, { url: t.thumbnail, title: `${t.title} (Trailer)`, project: t.title });
        }
      }
    });

    return Array.from(map.values());
  }, [projects, trailers]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return mediaItems;
    const q = search.toLowerCase();
    return mediaItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.project && item.project.toLowerCase().includes(q))
    );
  }, [mediaItems, search]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-space-800 border border-[#2a2a2a] rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#2a2a2a] flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-accent" />
              {title}
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Reuse previously uploaded images without duplicating files on Cloudinary
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-space-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#2a2a2a] bg-space-900/50 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search images by project name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-space-800 text-sm text-white placeholder-gray-500 border border-[#2a2a2a] focus:border-accent focus:outline-none transition"
            />
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-gray-500 space-y-2">
              <ImageIcon className="w-10 h-10 mx-auto text-gray-600" />
              <p className="text-sm">No images found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.url}
                    onClick={() => setSelectedUrl(item.url)}
                    className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                      isSelected
                        ? "border-accent ring-2 ring-accent scale-[0.98]"
                        : "border-[#2a2a2a] hover:border-gray-500"
                    }`}
                  >
                    <div className="aspect-[4/3] bg-space-900">
                      <img
                        src={getOptimizedUrl(item.url, { width: 400 })}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Label */}
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs p-1.5 text-[10px] text-gray-300 truncate">
                      {item.title}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a2a2a] bg-space-900/50 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-gray-400">
            {filteredItems.length} images available
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-space-700 text-gray-300 text-sm font-medium hover:bg-space-600 transition border border-[#2a2a2a]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLibraryModal;
