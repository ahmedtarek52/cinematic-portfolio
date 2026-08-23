import { useState, useCallback } from "react";
import { Upload, X, GripVertical, FolderOpen } from "lucide-react";
import { uploadToCloudinary, deleteFromCloudinary } from "../../lib/cloudinary";
import MediaLibraryModal from "./MediaLibraryModal";

const MultiImageUploader = ({ value = [], onChange, folder, label }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleUpload = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      setError(null);
      setUploading(true);
      try {
        const results = [];
        for (const file of files) {
          const result = await uploadToCloudinary(file, folder);
          results.push(result.url);
        }
        onChange([...value, ...results]);
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, value]
  );

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) handleUpload(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) handleUpload(files);
  };

  const handleRemove = (index) => {
    const removedUrl = value[index];
    if (removedUrl) {
      deleteFromCloudinary(removedUrl).catch((e) =>
        console.warn("Could not delete removed image:", e)
      );
    }
    onChange(value.filter((_, i) => i !== index));
  };

  // Drag reorder
  const handleDragStart = (index) => setDragIndex(index);
  const handleDragEnter = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const newItems = [...value];
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, moved);
    setDragIndex(index);
    onChange(newItems);
  };
  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="text-xs text-accent hover:underline flex items-center gap-1 font-medium transition cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Add from Library
        </button>
      </div>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`relative group rounded-lg overflow-hidden border border-[#2a2a2a] bg-space-800 cursor-grab active:cursor-grabbing ${
                dragIndex === index ? "opacity-50 ring-2 ring-accent" : ""
              }`}
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-28 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <GripVertical className="w-4 h-4 text-white/70" />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1.5 rounded-full bg-red-500/40 text-red-300 hover:bg-red-500/60 transition cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="absolute bottom-1 left-1 bg-black/60 text-[10px] text-white/70 px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add More Drop Zone / Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          className={`flex items-center justify-center h-20 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? "border-accent bg-accent/10"
              : "border-[#2a2a2a] bg-space-800/50 hover:border-gray-500"
          }`}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-xs">Uploading & deduplicating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Upload className="w-4 h-4" />
              <span className="text-xs font-medium">Upload New Files</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>

        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="flex items-center justify-center gap-2 h-20 rounded-xl border border-[#2a2a2a] bg-space-800/50 hover:bg-space-800 text-gray-300 hover:text-white transition cursor-pointer"
        >
          <FolderOpen className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium">Select from Existing Media</span>
        </button>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelect={(selectedUrl) => {
          if (!value.includes(selectedUrl)) {
            onChange([...value, selectedUrl]);
          }
        }}
        title="Add to Stills Gallery"
      />
    </div>
  );
};

export default MultiImageUploader;
