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

/**
 * Clear the local upload hash cache.
 */
export function clearHashCache() {
  try {
    localStorage.removeItem(HASH_CACHE_KEY);
  } catch (e) {}
}

// Automatically clear legacy hash cache to prevent stale 404 URL loops
clearHashCache();

/**
 * Calculate SHA-256 hash of a file.
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
 * Always performs direct Cloudinary upload to ensure the returned asset is active and valid.
 *
 * @param {File} file - The file to upload
 * @param {string} folder - Cloudinary folder path, e.g. "portfolio/trailers"
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(file, folder) {
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
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
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
 * @param {string} [options.quality] - Quality setting ("auto", "auto:good", "auto:best")
 * @returns {string}
 */
export function getOptimizedUrl(originalUrl, options = {}) {
  if (!originalUrl || typeof originalUrl !== "string") {
    return originalUrl || "";
  }

  // If not a Cloudinary upload URL, return original as-is
  if (!originalUrl.includes("cloudinary.com") || !originalUrl.includes("/upload/")) {
    return originalUrl;
  }

  // Build transform string
  const transformList = [
    "f_auto",
    options.quality ? `q_${options.quality}` : "q_auto",
  ];

  if (options.width) {
    transformList.push(`w_${options.width}`);
    transformList.push(`c_${options.crop || "limit"}`);
  } else if (options.height) {
    transformList.push(`h_${options.height}`);
    transformList.push(`c_${options.crop || "limit"}`);
  }

  const transformString = transformList.join(",");

  // 1. If URL has a version tag: /upload/(optional_old_transforms/)v123456/path/to/img.ext
  const versionMatch = originalUrl.match(
    /(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:[^/]+\/)*(v\d+\/.+)$/i
  );
  if (versionMatch) {
    const uploadPrefix = versionMatch[1]; // e.g. "https://res.cloudinary.com/do85jzh6y/image/upload/"
    const versionAndAsset = versionMatch[2]; // e.g. "v1740345678/portfolio/projects/p_05/img.jpg"
    return `${uploadPrefix}${transformString}/${versionAndAsset}`;
  }

  // 2. If URL has no version tag: /upload/(optional_old_transforms/)path/to/img.ext
  const uploadIdx = originalUrl.indexOf("/upload/");
  const uploadPrefix = originalUrl.substring(0, uploadIdx + "/upload/".length);
  const remaining = originalUrl.substring(uploadIdx + "/upload/".length);

  // If first segment is a known Cloudinary transform string (e.g. f_auto,q_auto)
  const segments = remaining.split("/");
  if (
    segments.length > 1 &&
    (segments[0].includes("f_") ||
      segments[0].includes("q_") ||
      segments[0].includes("w_") ||
      segments[0].includes("c_"))
  ) {
    segments.shift();
  }

  return `${uploadPrefix}${transformString}/${segments.join("/")}`;
}
