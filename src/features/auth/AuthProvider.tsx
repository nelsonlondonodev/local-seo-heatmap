import { useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './hooks/useAuth';
import type { UserProfile } from './types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
}

/**
 * Robust AuthProvider using an Atomic State pattern.
 * Prevents re-render cascades common in Supabase + React 19 apps.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;
    let lastToken = '';

    const initAuth = async () => {
      try {
        console.log('[AUTH] Syncing initial session...');
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (initialSession) {
          console.log('[AUTH] Initial session found.');
          lastToken = initialSession.access_token;
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', initialSession.user.id)
            .single();

          if (profileError) console.error('[AUTH] Initial profile fetch error:', profileError);

          if (mounted) {
            setAuthState({
              user: initialSession.user,
              session: initialSession,
              profile: profile as UserProfile | null,
              isLoading: false,
            });
          }
        } else {
          console.log('[AUTH] No initial session.');
          if (mounted) {
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        }
      } catch (error) {
        console.error('[AUTH] Critical Auth Initialization Error:', error);
        if (mounted) setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        if (!mounted) return;
        
        console.log(`[AUTH] Event fired: ${event}`);

        const currentToken = currentSession?.access_token || 'none';
        if (currentToken === lastToken && event !== 'SIGNED_OUT') {
          console.log('[AUTH] Redundant event ignored.');
          return;
        }
        
        lastToken = currentToken;

        if (currentSession) {
          console.log('[AUTH] Fetching profile for current session...');
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (mounted) {
            setAuthState({
              user: currentSession.user,
              session: currentSession,
              profile: profile as UserProfile | null,
              isLoading: false,
            });
          }
        } else {
          console.log('[AUTH] No active session.');
          if (mounted) {
            setAuthState({
              user: null,
              session: null,
              profile: null,
              isLoading: false,
            });
          }
        }
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
    // State will be cleared by onAuthStateChange SIGNED_OUT event
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

  const value = useMemo(() => ({
    ...authState,
    role: authState.profile?.role || null,
    agencyId: authState.profile?.agency_id || null,
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  }), [authState, signIn, signUp, signOut, signInWithGoogle]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
