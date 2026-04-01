import { useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './hooks/useAuth';
import type { UserProfile, UserRole } from './types';

/**
 * Provider component for Authentication and User Profile management.
 * Consolidates session events into atomic state updates.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let lastSessionId = '';

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (!mounted) return;

        // Block redundant session initialization to prevent loops
        const currentId = currentSession?.access_token || 'none';
        if (currentId === lastSessionId) {
          setIsLoading(false);
          return;
        }
        
        lastSessionId = currentId;

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();

            if (error) throw error;
            if (mounted) setProfile(data as UserProfile);
          } catch (e) {
            console.error('Error fetching user profile:', e);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
        
        if (mounted) setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); 

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setUser(null);
    setProfile(null);
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

  // UseMemo to stabilize the context object and prevent re-render cascades
  const value = useMemo(() => ({
    user,
    profile,
    session,
    isLoading,
    role: profile?.role || (null as UserRole | null),
    agencyId: profile?.agency_id || (null as string | null),
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  }), [user, profile, session, isLoading, signIn, signUp, signOut, signInWithGoogle]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
