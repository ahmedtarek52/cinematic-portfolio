/**
 * Cloudinary Deduplication & Orphan Asset Cleanup Script
 *
 * 1. Fetches all active image URLs from Supabase (projects & trailers).
 * 2. Scans Cloudinary assets using the Admin API.
 * 3. Identifies duplicate / unreferenced images.
 * 4. Deletes unused duplicates to free up storage.
 *
 * Usage:
 *   node scripts/cleanup-cloudinary.mjs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// ─── 1. Load Environment Variables from .env ─────────────────────────
try {
  if (fs.existsSync(".env")) {
    const envContent = fs.readFileSync(".env", "utf-8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...rest] = trimmed.split("=");
        if (key && rest.length > 0 && !process.env[key.trim()]) {
          process.env[key.trim()] = rest.join("=").trim();
        }
      }
    });
  }
} catch (e) {}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const cloudName =
  process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey =
  process.env.VITE_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
const apiSecret =
  process.env.VITE_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

if (!supabaseUrl || !serviceRoleKey || !cloudName || !apiKey || !apiSecret) {
  console.error("❌ Missing required Supabase or Cloudinary credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// ─── 2. Helpers ─────────────────────────────────────────────────────
function generateSha1(str) {
  return crypto.createHash("sha1").update(str).digest("hex");
}

function extractPublicId(url) {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return null;
  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;
    let pathAfterUpload = url.substring(uploadIndex + "/upload/".length);
    const versionMatch = pathAfterUpload.match(/^.*?v\d+\/(.+)$/);
    if (versionMatch) {
      pathAfterUpload = versionMatch[1];
    } else {
      const segments = pathAfterUpload.split("/");
      while (
        segments.length > 1 &&
        /^(?:[a-z]{1,3}_|f_|q_|c_|w_|h_|dpr_|b_|e_|o_|r_|a_)/.test(segments[0])
      ) {
        segments.shift();
      }
      pathAfterUpload = segments.join("/");
    }
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }
    return pathAfterUpload || null;
  } catch (e) {
    return null;
  }
}

async function listCloudinaryResources(nextCursor = null) {
  const authHeader = "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  let url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=500`;
  if (nextCursor) url += `&next_cursor=${nextCursor}`;

  const res = await fetch(url, {
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch Cloudinary resources: ${res.statusText}`);
  }

  return res.json();
}

async function deleteCloudinaryAsset(publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const sigString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = generateSha1(sigString);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

// ─── 3. Main Deduplication / Cleanup ────────────────────────────────
async function cleanup() {
  console.log("🔍 Scanning Supabase for active images...\n");

  // A. Collect active publicIds from Supabase
  const activePublicIds = new Set();

  const { data: projects } = await supabase.from("projects").select("hero_image, thumbnail, stills");
  (projects || []).forEach((p) => {
    const heroId = extractPublicId(p.hero_image);
    if (heroId) activePublicIds.add(heroId);

    const thumbId = extractPublicId(p.thumbnail);
    if (thumbId) activePublicIds.add(thumbId);

    if (Array.isArray(p.stills)) {
      p.stills.forEach((s) => {
        const stillId = extractPublicId(s);
        if (stillId) activePublicIds.add(stillId);
      });
    }
  });

  const { data: trailers } = await supabase.from("trailers").select("thumbnail");
  (trailers || []).forEach((t) => {
    const thumbId = extractPublicId(t.thumbnail);
    if (thumbId) activePublicIds.add(thumbId);
  });

  console.log(`✅ Found ${activePublicIds.size} unique active images referenced in Supabase.`);

  // B. Fetch all resources currently in Cloudinary
  console.log("\n☁️ Fetching all images from Cloudinary...");
  let allCloudinaryAssets = [];
  let nextCursor = null;

  do {
    const data = await listCloudinaryResources(nextCursor);
    if (data.resources) {
      allCloudinaryAssets.push(...data.resources);
    }
    nextCursor = data.next_cursor;
  } while (nextCursor);

  console.log(`✅ Found ${allCloudinaryAssets.length} total images in Cloudinary.`);

  // C. Find duplicates and unreferenced assets
  const orphans = allCloudinaryAssets.filter((asset) => !activePublicIds.has(asset.public_id));

  console.log(`\n🧹 Found ${orphans.length} unused/duplicate images in Cloudinary to clean up.`);

  if (orphans.length === 0) {
    console.log("✨ No duplicate or orphaned images found! Cloudinary is clean.");
    return;
  }

  // D. Delete orphans
  console.log("\n🗑️ Deleting duplicates...");
  for (let i = 0; i < orphans.length; i++) {
    const orphan = orphans[i];
    console.log(`  [${i + 1}/${orphans.length}] Deleting: ${orphan.public_id} (${Math.round(orphan.bytes / 1024)} KB)`);
    try {
      await deleteCloudinaryAsset(orphan.public_id);
    } catch (err) {
      console.warn(`    ⚠️ Failed to delete ${orphan.public_id}:`, err.message);
    }
  }

  console.log("\n✨ Cleanup finished! All duplicates have been removed.");
}

cleanup().catch(console.error);
