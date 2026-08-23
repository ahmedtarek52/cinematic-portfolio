import { supabase } from "../lib/supabaseClient";

// ──────────────────────────────────────────────────────
// Careers (job openings)
// ──────────────────────────────────────────────────────

function mapRowToCareer(row) {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    description: row.description,
    requirements: row.requirements || [],
    active: row.active,
    sortOrder: row.sort_order,
  };
}

function mapCareerToRow(c) {
  const row = {};
  if (c.id !== undefined) row.id = c.id;
  if (c.title !== undefined) row.title = c.title;
  if (c.department !== undefined) row.department = c.department;
  if (c.location !== undefined) row.location = c.location;
  if (c.type !== undefined) row.type = c.type;
  if (c.description !== undefined) row.description = c.description;
  if (c.requirements !== undefined) row.requirements = c.requirements;
  if (c.active !== undefined) row.active = c.active;
  if (c.sortOrder !== undefined) row.sort_order = c.sortOrder;
  return row;
}

export async function getAllCareers(activeOnly = false) {
  let query = supabase
    .from("careers")
    .select("*")
    .order("sort_order", { ascending: true });
  if (activeOnly) {
    query = query.eq("active", true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapRowToCareer);
}

export async function getCareerById(id) {
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return mapRowToCareer(data);
}

export async function createCareer(payload) {
  const { data, error } = await supabase
    .from("careers")
    .insert(mapCareerToRow(payload))
    .select()
    .single();
  if (error) throw error;
  return mapRowToCareer(data);
}

export async function updateCareer(id, payload) {
  const { data, error } = await supabase
    .from("careers")
    .update(mapCareerToRow(payload))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapRowToCareer(data);
}

export async function deleteCareer(id) {
  const { error } = await supabase.from("careers").delete().eq("id", id);
  if (error) throw error;
}
