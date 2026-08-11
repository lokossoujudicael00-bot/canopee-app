import { createClient } from "@supabase/supabase-js";

// Utilisé uniquement côté serveur (routes API). Ne jamais importer ce fichier
// dans un composant "use client".
export function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
