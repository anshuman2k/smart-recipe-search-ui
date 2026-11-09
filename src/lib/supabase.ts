import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase configuration.\n" +
      "Create a .env file in the project root with:\n" +
      "  VITE_SUPABASE_URL=https://your-project.supabase.co\n" +
      "  VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key\n"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

