import { createClient } from "@supabase/supabase-js";

// Public-facing values — safe to expose in client-side code. Real protection
// comes from the Row Level Security policies defined in the database schema,
// not from keeping these secret.
const SUPABASE_URL = "https://iiinpopqwpmpianjqqjx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_H3OzlxweF4f2jySr5i8LyA_xsoy0ZtM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
