/**
 * Cloudinary Integration Utility
 * Supports direct unsigned uploads, URL transformations, and signed asset deletion.
 */

/**
 * Generate SHA-1 hash for Cloudinary signed API calls using Web Crypto API.
 * @param {string} message
 * @returns {Promise<string>}
 */
async function generateSha1(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const HASH_CACHE_KEY = "portfolio_cloudinary_hash_map";

function getHashCache() {
  try {
    const raw = localStorage.getItem(HASH_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveHashCache(hash, data) {
  try {
    const cache = getHashCache();
    cache[hash] = data;
    localStorage.setItem(HASH_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

/**
 * Calculate SHA-256 hash of a file for content-based deduplication.
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function calculateFileHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Upload a file to Cloudinary via unsigned upload preset.
 * Automatically checks content hash to prevent duplicate uploads if the file already exists.
 *
 * @param {File} file - The file to upload
 * @param {string} folder - Cloudinary folder path, e.g. "portfolio/projects/nocturne"
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(file, folder) {
  // 1. Content Hash Deduplication: Check if identical file was already uploaded
  try {
    const fileHash = await calculateFileHash(file);
    const cache = getHashCache();
    if (cache[fileHash] && cache[fileHash].url) {
      // Re-use already uploaded image without making another network upload
      return cache[fileHash];
    }
  } catch (e) {
    console.warn("Could not compute file hash for deduplication:", e);
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
    import.meta.env.VITE_CLOUDINARY_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary credentials missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env"
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (folder) {
    formData.append("folder", folder);
  }

  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Cloudinary upload failed (${res.status})`
    );
  }

  const data = await res.json();
  const result = {
    url: data.secure_url,
    publicId: data.public_id,
  };

  // Cache the uploaded asset by file content hash
  try {
    const fileHash = await calculateFileHash(file);
    saveHashCache(fileHash, result);
  } catch (e) {}

  return result;
}

/**
 * Extract publicId from any Cloudinary URL (with or without transformations/versions).
 *
 * @param {string} url - Full Cloudinary image URL
 * @returns {string|null} - Extracted publicId (e.g. "portfolio/projects/sample")
 */
export function extractPublicId(url) {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
    return null;
  }

  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let pathAfterUpload = url.substring(uploadIndex + "/upload/".length);

    // If there is a version prefix (e.g. v1740345678/path/to/img)
    const versionMatch = pathAfterUpload.match(/^.*?v\d+\/(.+)$/);
    if (versionMatch) {
      pathAfterUpload = versionMatch[1];
    } else {
      // Filter out transformation segments (e.g., f_auto,q_auto, w_500, etc.)
      const segments = pathAfterUpload.split("/");
      while (
        segments.length > 1 &&
        /^(?:[a-z]{1,3}_|f_|q_|c_|w_|h_|dpr_|b_|e_|o_|r_|a_)/.test(segments[0])
      ) {
        segments.shift();
      }
      pathAfterUpload = segments.join("/");
    }

    // Remove file extension (.jpg, .png, .webp, etc.)
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }

    return pathAfterUpload || null;
  } catch (err) {
    console.error("Error extracting Cloudinary publicId:", err);
    return null;
  }
}

/**
 * Delete a single image from Cloudinary using publicId or image URL.
 *
 * @param {string} urlOrPublicId - Cloudinary image URL or publicId
 * @returns {Promise<{result: string}>}
 */
export async function deleteFromCloudinary(urlOrPublicId) {
  if (!urlOrPublicId) return { result: "skipped" };

  const publicId = urlOrPublicId.includes("cloudinary.com")
    ? extractPublicId(urlOrPublicId)
    : urlOrPublicId;

  if (!publicId) {
    console.warn("Could not extract Cloudinary publicId for deletion:", urlOrPublicId);
    return { result: "skipped" };
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      "Cloudinary delete credentials missing. Ensure VITE_CLOUDINARY_API_KEY and VITE_CLOUDINARY_API_SECRET are configured in .env"
    );
    return { result: "skipped_no_credentials" };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = await generateSha1(signatureString);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error(`Cloudinary deletion error for ${publicId}:`, errorData);
    throw new Error(
      errorData.error?.message || `Failed to delete from Cloudinary (${res.status})`
    );
  }

  const data = await res.json();
  return data;
}

/**
 * Delete multiple images from Cloudinary in parallel.
 *
 * @param {string[]} urlsOrPublicIds - Array of URLs or publicIds to delete
 * @returns {Promise<PromiseSettledResult<any>[]>}
 */
export async function deleteImagesFromCloudinary(urlsOrPublicIds = []) {
  if (!Array.isArray(urlsOrPublicIds) || urlsOrPublicIds.length === 0) {
    return [];
  }

  const validItems = urlsOrPublicIds.filter(Boolean);
  return Promise.allSettled(validItems.map((item) => deleteFromCloudinary(item)));
}

/**
 * Generate an optimized Cloudinary delivery URL with auto-format, auto-quality, and responsive width.
 * Transforms 6MB-10MB PNGs into lightweight ~50KB-150KB WebP/AVIF images.
 *
 * @param {string} originalUrl - The secure_url returned from upload or Supabase
 * @param {object} [options] - Transform options
 * @param {number} [options.width=1200] - Max display width in pixels
 * @param {number} [options.height] - Max display height in pixels
 * @param {string} [options.crop="limit"] - Crop mode ("limit", "fill", "fit", "thumb")
 * @param {string} [options.quality="auto"] - Quality setting ("auto", "auto:good", "auto:best")
 * @returns {string}
 */
export function getOptimizedUrl(originalUrl, options = {}) {
  if (!originalUrl || typeof originalUrl !== "string") {
    return originalUrl || "";
  }

  if (!originalUrl.includes("cloudinary.com") || !originalUrl.includes("/upload/")) {
    return originalUrl;
  }

  const uploadIdx = originalUrl.indexOf("/upload/");
  const baseUrl = originalUrl.substring(0, uploadIdx + "/upload/".length);
  let rest = originalUrl.substring(uploadIdx + "/upload/".length);

  // If there are existing transformation parameters before version or folder, strip them
  // e.g. /upload/f_auto,q_auto/v1234/file.jpg -> rest becomes v1234/file.jpg
  const transformMatch = rest.match(/^(?:[a-z0-9_,:]+\/)+(v\d+\/.+)$/i);
  if (transformMatch) {
    rest = transformMatch[1];
  } else {
    // If no version tag, check if first segment is a transform string
    const segments = rest.split("/");
    if (segments.length > 1 && /^(?:[a-z]{1,3}_|f_|q_|c_|w_|h_|dpr_|b_|e_|o_|r_|a_)/.test(segments[0])) {
      segments.shift();
      rest = segments.join("/");
    }
  }

  const transforms = [
    "f_auto", // Deliver next-gen WebP/AVIF format
    options.quality ? `q_${options.quality}` : "q_auto:good", // Smart compression
  ];

  if (options.width) {
    transforms.push(`w_${options.width}`);
    transforms.push(`c_${options.crop || "limit"}`);
  } else if (options.height) {
    transforms.push(`h_${options.height}`);
    transforms.push(`c_${options.crop || "limit"}`);
  } else {
    transforms.push("w_1400");
    transforms.push("c_limit");
  }

  return `${baseUrl}${transforms.join(",")}/${rest}`;
}
