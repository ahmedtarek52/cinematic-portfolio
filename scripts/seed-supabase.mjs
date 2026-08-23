/**
 * Seed Supabase & Cloudinary — Migration Script
 *
 * 1. Reads local assets from public/images/
 * 2. Uploads all hero images, thumbnails, and stills to Cloudinary
 * 3. Replaces local image paths with Cloudinary secure_url
 * 4. Upserts full project & trailer records into Supabase
 *
 * Usage:
 *   node scripts/seed-supabase.mjs
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
} catch (e) {
  // ignore
}

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const cloudName =
  process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const uploadPreset =
  process.env.VITE_CLOUDINARY_UPLOAD_PRESET ||
  process.env.VITE_CLOUDINARY_PRESET ||
  process.env.CLOUDINARY_UPLOAD_PRESET;
const apiKey =
  process.env.VITE_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
const apiSecret =
  process.env.VITE_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

if (!cloudName) {
  console.error("❌ Missing VITE_CLOUDINARY_CLOUD_NAME in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// ─── 2. Cloudinary Upload Helper ────────────────────────────────────
const urlCache = new Map(); // In-memory cache to avoid uploading identical files twice

function generateSha1(str) {
  return crypto.createHash("sha1").update(str).digest("hex");
}

async function uploadImageToCloudinary(imagePath, folder = "portfolio/projects") {
  if (!imagePath) return imagePath;

  // If already uploaded in this run
  if (urlCache.has(imagePath)) {
    return urlCache.get(imagePath);
  }

  // If already a Cloudinary URL, keep as is
  if (imagePath.includes("cloudinary.com")) {
    return imagePath;
  }

  try {
    let body;
    let endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      // Remote URL (e.g. Vimeo thumbnail)
      formData.append("file", imagePath);
    } else {
      // Local path relative to public directory
      let normalized = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
      try {
        normalized = decodeURIComponent(normalized);
      } catch (e) {}

      const pathSegments = normalized.split(/[\/\\]/);
      let absolutePath = path.resolve(process.cwd(), "public", ...pathSegments);

      if (!fs.existsSync(absolutePath)) {
        absolutePath = path.resolve(process.cwd(), "dist", ...pathSegments);
      }

      if (!fs.existsSync(absolutePath)) {
        absolutePath = path.resolve(process.cwd(), normalized);
      }

      if (!fs.existsSync(absolutePath)) {
        console.warn(`    ⚠️ File not found locally: ${imagePath} (tried ${absolutePath}), keeping original path.`);
        return imagePath;
      }

      const fileBuffer = fs.readFileSync(absolutePath);
      const blob = new Blob([fileBuffer]);
      formData.append("file", blob, path.basename(absolutePath));
    }

    if (uploadPreset) {
      formData.append("upload_preset", uploadPreset);
    }

    if (folder) {
      formData.append("folder", folder);
    }

    // If API secret is present, we can also add timestamp and signature as backup
    if (apiKey && apiSecret && !uploadPreset) {
      const timestamp = Math.floor(Date.now() / 1000);
      const sigString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = generateSha1(sigString);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
    }

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn(`    ⚠️ Cloudinary upload failed for ${imagePath}:`, err.error?.message || res.statusText);
      return imagePath;
    }

    const data = await res.json();
    const secureUrl = data.secure_url;
    urlCache.set(imagePath, secureUrl);
    return secureUrl;
  } catch (err) {
    console.warn(`    ⚠️ Upload error for ${imagePath}:`, err.message);
    return imagePath;
  }
}

// ─── 3. Import Static Data ──────────────────────────────────────────
const { projects } = await import("../src/data/projects.js");
const { trailers } = await import("../src/data/trailers.js");

// ─── 4. Main Migration Flow ─────────────────────────────────────────
async function run() {
  console.log("🎬 Starting Full Migration: Cloudinary Upload + Supabase Seed...\n");

  // ── A. Upload & Seed Projects ─────────────────────────────────────
  console.log(`📁 Processing ${projects.length} projects...`);
  const projectRows = [];

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    console.log(`  [${i + 1}/${projects.length}] Uploading assets for "${p.title}"...`);

    const heroImage = await uploadImageToCloudinary(p.heroImage, `portfolio/projects/${p.id}`);
    const thumbnail = p.thumbnail === p.heroImage
      ? heroImage
      : await uploadImageToCloudinary(p.thumbnail, `portfolio/projects/${p.id}`);

    const stills = [];
    if (Array.isArray(p.stills)) {
      for (const still of p.stills) {
        const uploadedStill = await uploadImageToCloudinary(still, `portfolio/projects/${p.id}/stills`);
        stills.push(uploadedStill);
      }
    }

    projectRows.push({
      id: p.id,
      title: p.title,
      category: p.category,
      year: p.year,
      type: p.type,
      hero_image: heroImage,
      thumbnail: thumbnail,
      description: p.description,
      services: p.services || [],
      tags: p.tags || [],
      metadata: p.metadata || "",
      overview: p.overview || "",
      approach: p.approach || "",
      stills: stills,
      credits: p.credits || [],
      tech_specs: p.techSpecs || {},
      vimeo: p.vimeo || null,
      sort_order: i,
    });
  }

  console.log(`\n💾 Upserting ${projectRows.length} projects with Cloudinary URLs into Supabase...`);
  const { error: projErr } = await supabase
    .from("projects")
    .upsert(projectRows, { onConflict: "id" });

  if (projErr) {
    console.error("  ❌ Supabase Projects error:", projErr.message);
  } else {
    console.log("  ✅ Projects successfully saved to Supabase with Cloudinary URLs!");
  }

  // ── B. Upload & Seed Trailers ─────────────────────────────────────
  console.log(`\n🎥 Processing ${trailers.length} trailers...`);
  const trailerRows = [];

  for (let i = 0; i < trailers.length; i++) {
    const t = trailers[i];
    console.log(`  [${i + 1}/${trailers.length}] Processing thumbnail for "${t.title}"...`);

    const thumbnail = await uploadImageToCloudinary(t.thumbnail, "portfolio/trailers");

    trailerRows.push({
      id: t.id,
      vimeo_id: t.vimeoId,
      title: t.title,
      subtitle: t.subtitle || null,
      year: t.year || null,
      duration: t.duration || null,
      category: t.category || null,
      filter_category: t.filterCategory || null,
      genre: t.genre || null,
      client: t.client || null,
      thumbnail: thumbnail,
      vimeo_review_url: t.vimeoReviewUrl || null,
      description: t.description || null,
      specs: t.specs || {},
      tags: t.tags || [],
      sort_order: i,
    });
  }

  console.log(`\n💾 Upserting ${trailerRows.length} trailers with Cloudinary URLs into Supabase...`);
  const { error: trailErr } = await supabase
    .from("trailers")
    .upsert(trailerRows, { onConflict: "id" });

  if (trailErr) {
    console.error("  ❌ Supabase Trailers error:", trailErr.message);
  } else {
    console.log("  ✅ Trailers successfully saved to Supabase with Cloudinary URLs!");
  }

  console.log("\n✨ Full migration complete! All media is now hosted on Cloudinary and synced with Supabase.");
}

run().catch(console.error);
