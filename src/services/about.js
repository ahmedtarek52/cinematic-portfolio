import { supabase } from "../lib/supabaseClient";

// ──────────────────────────────────────────────────────
// About Content (singleton row, id = 1)
// ──────────────────────────────────────────────────────

export async function getAboutContent() {
  const { data, error } = await supabase
    .from("about_content")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) {
    // If no row exists yet, return empty defaults
    if (error.code === "PGRST116") {
      return {
        hero: {},
        profile: {},
        sections: [],
        skills: [],
      };
    }
    throw error;
  }
  return {
    hero: data.hero || {},
    profile: data.profile || {},
    sections: data.sections || [],
    skills: data.skills || [],
  };
}

export async function updateAboutContent(payload) {
  const { data, error } = await supabase
    .from("about_content")
    .upsert({
      id: 1,
      hero: payload.hero,
      profile: payload.profile,
      sections: payload.sections,
      skills: payload.skills,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
