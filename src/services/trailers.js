import { supabase } from "../lib/supabaseClient";
import { deleteFromCloudinary } from "../lib/cloudinary";
import { isImageReferencedElsewhere } from "./projects";

// ──────────────────────────────────────────────────────
// Row Mappers
// ──────────────────────────────────────────────────────

function mapRowToTrailer(row) {
  return {
    id: row.id,
    vimeoId: row.vimeo_id,
    title: row.title,
    subtitle: row.subtitle,
    year: row.year,
    duration: row.duration,
    category: row.category,
    filterCategory: row.filter_category,
    genre: row.genre,
    client: row.client,
    thumbnail: row.thumbnail,
    vimeoReviewUrl: row.vimeo_review_url,
    description: row.description,
    specs: row.specs || {},
    tags: row.tags || [],
    sortOrder: row.sort_order,
  };
}

function mapTrailerToRow(t) {
  const row = {};
  if (t.id !== undefined) row.id = t.id;
  if (t.vimeoId !== undefined) row.vimeo_id = t.vimeoId;
  if (t.title !== undefined) row.title = t.title;
  if (t.subtitle !== undefined) row.subtitle = t.subtitle;
  if (t.year !== undefined) row.year = t.year;
  if (t.duration !== undefined) row.duration = t.duration;
  if (t.category !== undefined) row.category = t.category;
  if (t.filterCategory !== undefined) row.filter_category = t.filterCategory;
  if (t.genre !== undefined) row.genre = t.genre;
  if (t.client !== undefined) row.client = t.client;
  if (t.thumbnail !== undefined) row.thumbnail = t.thumbnail;
  if (t.vimeoReviewUrl !== undefined) row.vimeo_review_url = t.vimeoReviewUrl;
  if (t.description !== undefined) row.description = t.description;
  if (t.specs !== undefined) row.specs = t.specs;
  if (t.tags !== undefined) row.tags = t.tags;
  if (t.sortOrder !== undefined) row.sort_order = t.sortOrder;
  return row;
}

// ──────────────────────────────────────────────────────
// Public Read Operations
// ──────────────────────────────────────────────────────

export async function getAllTrailers() {
  const { data, error } = await supabase
    .from("trailers")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data.map(mapRowToTrailer);
}

export async function getTrailerById(id) {
  const { data, error } = await supabase
    .from("trailers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return mapRowToTrailer(data);
}

// ──────────────────────────────────────────────────────
// Admin CRUD Operations
// ──────────────────────────────────────────────────────

export async function createTrailer(payload) {
  const { data, error } = await supabase
    .from("trailers")
    .insert(mapTrailerToRow(payload))
    .select()
    .single();
  if (error) throw error;
  return mapRowToTrailer(data);
}

export async function updateTrailer(id, payload) {
  const { data, error } = await supabase
    .from("trailers")
    .update(mapTrailerToRow(payload))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapRowToTrailer(data);
}

export async function deleteTrailer(id) {
  // 1. Fetch trailer before deletion to retrieve Cloudinary thumbnail URL
  let trailerToDelete = null;
  try {
    trailerToDelete = await getTrailerById(id);
  } catch (err) {
    console.warn("Could not find trailer to collect thumbnail before deletion:", err);
  }

  // 2. Delete the record from Supabase
  const { error } = await supabase.from("trailers").delete().eq("id", id);
  if (error) throw error;

  // 3. Delete thumbnail from Cloudinary if present and not referenced elsewhere
  if (trailerToDelete?.thumbnail) {
    const isUsed = await isImageReferencedElsewhere(trailerToDelete.thumbnail);
    if (!isUsed) {
      deleteFromCloudinary(trailerToDelete.thumbnail).catch((err) => {
        console.error("Error deleting trailer thumbnail from Cloudinary:", err);
      });
    }
  }
}
