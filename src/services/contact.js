import { supabase } from "../lib/supabaseClient";
import { sendContactEmail } from "./email";

// ──────────────────────────────────────────────────────
// Contact Info (singleton row, id = 1)
// ──────────────────────────────────────────────────────

export async function getContactInfo() {
  const { data, error } = await supabase
    .from("contact_info")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) {
    if (error.code === "PGRST116") {
      return {
        heading: "",
        title: "",
        residing: {},
        stateHome: {},
        email: "",
        kakao: "",
        social: {},
      };
    }
    throw error;
  }
  return {
    heading: data.heading,
    title: data.title,
    residing: data.residing || {},
    stateHome: data.state_home || {},
    email: data.email,
    kakao: data.kakao,
    social: data.social || {},
  };
}

export async function updateContactInfo(payload) {
  const { data, error } = await supabase
    .from("contact_info")
    .upsert({
      id: 1,
      heading: payload.heading,
      title: payload.title,
      residing: payload.residing,
      state_home: payload.stateHome,
      email: payload.email,
      kakao: payload.kakao,
      social: payload.social,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ──────────────────────────────────────────────────────
// Contact Messages (form submissions)
// ──────────────────────────────────────────────────────

export async function submitContactMessage({ firstName, lastName, email, message }) {
  // Routes to /api/send-email which securely writes to Supabase using admin service key
  // and delivers the notification email to Mahmoud via Resend
  return await sendContactEmail({ firstName, lastName, email, message });
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((msg) => ({
    id: msg.id,
    firstName: msg.first_name,
    lastName: msg.last_name,
    email: msg.email,
    message: msg.message,
    createdAt: msg.created_at,
    read: msg.read,
  }));
}

export async function markMessageRead(id) {
  const { error } = await supabase
    .from("contact_messages")
    .update({ read: true })
    .eq("id", id);
  if (error) throw error;
}
