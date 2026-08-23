import { supabase } from "../lib/supabaseClient";

// ──────────────────────────────────────────────────────
// Services Catalog (studio service offerings)
// ──────────────────────────────────────────────────────

function mapRowToService(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    details: row.details || [],
    sortOrder: row.sort_order,
  };
}

function mapServiceToRow(s) {
  const row = {};
  if (s.id !== undefined) row.id = s.id;
  if (s.title !== undefined) row.title = s.title;
  if (s.description !== undefined) row.description = s.description;
  if (s.icon !== undefined) row.icon = s.icon;
  if (s.details !== undefined) row.details = s.details;
  if (s.sortOrder !== undefined) row.sort_order = s.sortOrder;
  return row;
}

export async function getAllServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data.map(mapRowToService);
}

export async function getServiceById(id) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return mapRowToService(data);
}

export async function createService(payload) {
  const { data, error } = await supabase
    .from("services")
    .insert(mapServiceToRow(payload))
    .select()
    .single();
  if (error) throw error;
  return mapRowToService(data);
}

export async function updateService(id, payload) {
  const { data, error } = await supabase
    .from("services")
    .update(mapServiceToRow(payload))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapRowToService(data);
}

export async function deleteService(id) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}
