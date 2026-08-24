import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, FolderOpen } from "lucide-react";
import { uploadToCloudinary, deleteFromCloudinary } from "../../lib/cloudinary";
import MediaLibraryModal from "./MediaLibraryModal";

const CloudinaryUploader = ({ value, onChange, folder, label }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleUpload = useCallback(
    async (file) => {
      if (!file) return;
      setError(null);
      setUploading(true);
      try {
        const oldUrl = value;
        const result = await uploadToCloudinary(file, folder);
        onChange(result.url);
        // Only clean up old image if it's not the same URL
        if (oldUrl && oldUrl !== result.url) {
          deleteFromCloudinary(oldUrl).catch((e) =>
            console.warn("Could not delete old image:", e)
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, value]
  );

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    if (value) {
      deleteFromCloudinary(value).catch((e) =>
        console.warn("Could not delete removed image:", e)
      );
    }
    onChange("");
  };

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
          Choose from Library
        </button>
      </div>

      {value ? (
        // Preview
        <div className="relative group rounded-xl overflow-hidden border border-[#2a2a2a] bg-space-800">
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowLibrary(true)}
              className="px-3 py-1.5 rounded-lg bg-accent/80 text-white text-xs font-medium hover:bg-accent transition cursor-pointer"
            >
              Choose Existing
            </button>
            <label className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium cursor-pointer hover:bg-white/30 transition">
              Replace File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-red-500/30 text-red-300 text-xs font-medium hover:bg-red-500/50 transition cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        // Drop zone
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed transition-all ${
            dragOver
              ? "border-accent bg-accent/10"
              : "border-[#2a2a2a] bg-space-800/50 hover:border-gray-500"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-xs">Processing & deduplicating...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <Upload className="w-7 h-7 text-gray-400" />
              <div>
                <p className="text-sm text-gray-300 font-medium">
                  Drop image here or{" "}
                  <label className="text-accent underline cursor-pointer hover:text-blue-400">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  JPG, PNG, WebP — automatically deduplicated
                </p>
              </div>
              {/* <button
                type="button"
                onClick={() => setShowLibrary(true)}
                className="px-3 py-1.5 rounded-lg bg-space-700 hover:bg-space-600 text-gray-300 text-xs font-medium border border-[#2a2a2a] transition flex items-center gap-1.5 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-accent" />
                Select Existing Library Image
              </button> */}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelect={(selectedUrl) => {
          onChange(selectedUrl);
        }}
        title={`Select ${label || "Image"}`}
      />
    </div>
  );
};

export default CloudinaryUploader;
