import { createClient } from "@supabase/supabase-js";

export const createBrowserSupabase = (url: string, anonKey: string) => {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
};
