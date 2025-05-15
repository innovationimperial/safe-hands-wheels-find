
import { Session, User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
};

export type DealerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

export type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  dealerProfile: DealerProfile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDealer: boolean;
  isDealerApproved: boolean;
};
