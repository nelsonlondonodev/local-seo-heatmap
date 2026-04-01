import type { Session, User } from '@supabase/supabase-js';

export type UserRole = 'super-admin' | 'owner' | 'admin' | 'staff' | 'client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  agency_id: string | null;
  plan: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  role: UserRole | null;
  agencyId: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}
