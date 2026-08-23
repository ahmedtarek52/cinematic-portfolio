import { supabase } from "../lib/supabaseClient";
import { deleteImagesFromCloudinary } from "../lib/cloudinary";

// ──────────────────────────────────────────────────────
// Row Mappers: snake_case (DB) ↔ camelCase (app)
// Keeps existing component prop names unchanged
// ──────────────────────────────────────────────────────

function mapRowToProject(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    year: row.year,
    type: row.type,
    heroImage: row.hero_image,
    thumbnail: row.thumbnail,
    description: row.description,
    services: row.services || [],
    tags: row.tags || [],
    metadata: row.metadata,
    overview: row.overview,
    approach: row.approach,
    stills: row.stills || [],
    credits: row.credits || [],
    techSpecs: row.tech_specs || {},
    vimeo: row.vimeo,
    sortOrder: row.sort_order,
  };
}

function mapProjectToRow(p) {
  const row = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.title !== undefined) row.title = p.title;
  if (p.category !== undefined) row.category = p.category;
  if (p.year !== undefined) row.year = p.year;
  if (p.type !== undefined) row.type = p.type;
  if (p.heroImage !== undefined) row.hero_image = p.heroImage;
  if (p.thumbnail !== undefined) row.thumbnail = p.thumbnail;
  if (p.description !== undefined) row.description = p.description;
  if (p.services !== undefined) row.services = p.services;
  if (p.tags !== undefined) row.tags = p.tags;
  if (p.metadata !== undefined) row.metadata = p.metadata;
  if (p.overview !== undefined) row.overview = p.overview;
  if (p.approach !== undefined) row.approach = p.approach;
  if (p.stills !== undefined) row.stills = p.stills;
  if (p.credits !== undefined) row.credits = p.credits;
  if (p.techSpecs !== undefined) row.tech_specs = p.techSpecs;
  if (p.vimeo !== undefined) row.vimeo = p.vimeo;
  if (p.sortOrder !== undefined) row.sort_order = p.sortOrder;
  return row;
}

// ──────────────────────────────────────────────────────
// Public Read Operations
// ──────────────────────────────────────────────────────

export async function getAllProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data.map(mapRowToProject);
}

export async function getProjectById(id) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return mapRowToProject(data);
}

export async function getRelatedProjects(currentProjectId, limit = 2) {
  const current = await getProjectById(currentProjectId);
  const all = await getAllProjects();
  return all
    .filter((p) => p.id !== currentProjectId)
    .filter(
      (p) =>
        p.category === current.category ||
        p.services.some((s) => current.services.includes(s))
    )
    .slice(0, limit);
}

export async function getCategories() {
  const all = await getAllProjects();
  return [...new Set(all.map((p) => p.category))].sort();
}

export async function getServicesList() {
  const all = await getAllProjects();
  const services = new Set();
  all.forEach((p) => p.services.forEach((s) => services.add(s)));
  return Array.from(services).sort();
}

export async function getYears() {
  const all = await getAllProjects();
  return [...new Set(all.map((p) => p.year))].sort().reverse();
}

// ──────────────────────────────────────────────────────
// Admin CRUD Operations
// ──────────────────────────────────────────────────────

export async function createProject(payload) {
  const { data, error } = await supabase
    .from("projects")
    .insert(mapProjectToRow(payload))
    .select()
    .single();
  if (error) throw error;
  return mapRowToProject(data);
}

export async function updateProject(id, payload) {
  const { data, error } = await supabase
    .from("projects")
    .update(mapProjectToRow(payload))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapRowToProject(data);
}

async function isImageReferencedElsewhere(imageUrl, excludeProjectId = null) {
  if (!imageUrl) return false;
  try {
    const { data: projects } = await supabase
      .from("projects")
      .select("id, hero_image, thumbnail, stills");

    const foundInProjects = (projects || []).some((p) => {
      if (excludeProjectId && p.id === excludeProjectId) return false;
      return (
        p.hero_image === imageUrl ||
        p.thumbnail === imageUrl ||
        (Array.isArray(p.stills) && p.stills.includes(imageUrl))
      );
    });
    if (foundInProjects) return true;

    const { data: trailers } = await supabase
      .from("trailers")
      .select("thumbnail");
    return (trailers || []).some((t) => t.thumbnail === imageUrl);
  } catch (e) {
    return false;
  }
}

export async function deleteProject(id) {
  // 1. Fetch project before deletion to retrieve Cloudinary image URLs
  let projectToDelete = null;
  try {
    projectToDelete = await getProjectById(id);
  } catch (err) {
    console.warn("Could not find project to collect images before deletion:", err);
  }

  // 2. Delete the record from Supabase
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;

  // 3. Delete only unreferenced images from Cloudinary
  if (projectToDelete) {
    const candidateImages = [];
    if (projectToDelete.heroImage) candidateImages.push(projectToDelete.heroImage);
    if (projectToDelete.thumbnail) candidateImages.push(projectToDelete.thumbnail);
    if (Array.isArray(projectToDelete.stills)) {
      candidateImages.push(...projectToDelete.stills);
    }

    const uniqueCandidates = [...new Set(candidateImages)];
    const imagesToDelete = [];

    for (const url of uniqueCandidates) {
      const isUsed = await isImageReferencedElsewhere(url, id);
      if (!isUsed) {
        imagesToDelete.push(url);
      }
    }

    if (imagesToDelete.length > 0) {
      deleteImagesFromCloudinary(imagesToDelete).catch((err) => {
        console.error("Error deleting project images from Cloudinary:", err);
      });
    }
  }
}
