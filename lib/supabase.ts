import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ewxtbzhgrnmtawipbajg.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable__68k9RVFf7-2hGxCtTpsug_6GNkmTqB";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
