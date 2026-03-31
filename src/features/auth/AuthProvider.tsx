import { useContext, createContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try real supabase auth
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
        } else if (import.meta.env.DEV) {
          // DEVELOPER MODE: Simulate a logged-in user for testing without Supabase
          console.warn('MapRanker: Using Mock Auth for development');
          const mockUser = { 
            id: 'dev-user-id', 
            email: 'dev@mapranker.app', 
            user_metadata: { full_name: 'Developer Mode' } 
          } as any;
          setUser(mockUser);
          setSession({ user: mockUser, access_token: 'mock-token', expires_in: 3600 } as any);
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
        // Fallback to mock in dev even on error
        if (import.meta.env.DEV) {
          const mockUser = { id: 'dev-user', email: 'dev@mapranker.app' } as any;
          setUser(mockUser);
          setSession({ user: mockUser } as any);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes if supabase is working
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    if (import.meta.env.DEV) {
      console.warn('MapRanker: Mock SignIn');
      const mockUser = { id: 'dev-user', email } as any;
      setUser(mockUser);
      setSession({ user: mockUser } as any);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: _password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, _password: string, fullName: string) => {
    if (import.meta.env.DEV) {
      console.warn('MapRanker: Mock SignUp');
      const mockUser = { id: 'dev-user', email, user_metadata: { full_name: fullName } } as any;
      setUser(mockUser);
      setSession({ user: mockUser } as any);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password: _password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, isLoading, signIn, signUp, signOut, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
