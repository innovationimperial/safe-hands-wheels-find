
/// <reference types="vite/client" />

// Extend Supabase profile type to include role
declare namespace Supabase {
  interface Profile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: string;
  }
}
