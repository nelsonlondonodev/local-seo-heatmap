import { useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext } from './hooks/useAuth';
import { profileService, type UserProfile } from '@/services/profileService';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
}

/**
 * CLEAN VERSION: Minimalist AuthProvider.
 * Removed local cache to prevent redirect loops between cookies and storage.
 * Added Panic Timeout (5s) for instant UI unblocking.
 * Refactored to use profileService for better scalability and multi-tenancy.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
  });

  const lastTokenRef = useRef<string>('');
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let mounted = true;

    const handleSession = async (session: Session | null, event?: string) => {
      if (!mounted) return;
      console.log(`[AUTH] Process: ${event || 'init'}`);

      const currentToken = session?.access_token || 'none';
      if (currentToken === lastTokenRef.current && event !== 'SIGNED_OUT' && event !== 'SIGNED_IN') {
        if (authState.isLoading) setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      lastTokenRef.current = currentToken;

      if (session) {
        const profile = await profileService.getProfile(session.user.id);
        if (mounted) {
          setAuthState({ user: session.user, session, profile, isLoading: false });
        }
      } else {
        if (mounted) {
          setAuthState({ user: null, session: null, profile: null, isLoading: false });
        }
      }
    };

    // 1. Initial Wake Up
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session, 'INITIAL');
    });

    // 2. Auth Listner
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleSession(session, event);
    });

    // 3. FINAL PANIC: 5 seconds timeout to force unblock UI
    const timer = setTimeout(() => {
      if (mounted && authState.isLoading) {
        console.warn('[AUTH] Panic Timeout: Unblocking UI.');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    }, 5000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: fullName } },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthState({ user: null, session: null, profile: null, isLoading: false });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }, []);

  const value = useMemo(() => ({
    ...authState,
    role: authState.profile?.role || null,
    agencyId: authState.profile?.agency_id || null,
    signIn, signUp, signOut, signInWithGoogle
  }), [authState, signIn, signUp, signOut, signInWithGoogle]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
