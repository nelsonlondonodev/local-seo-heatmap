import { useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
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

const CACHE_KEY = 'mapranker_auth_cache_v2';

/**
 * PRODUCTION-GRADE AuthProvider.
 * Solves: Infinite loops, redirect bounces, and Google OAuth hang issues.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. Initial State from Cache (Optional UI Speedup)
  const [authState, setAuthState] = useState<AuthState>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        return { ...data, isLoading: true };
      } catch (e) { /* corrupted cache */ }
    }
    return { user: null, profile: null, session: null, isLoading: true };
  });

  const lastTokenRef = useRef<string>('');
  const isInitializingRef = useRef(false);

  // Helper to persist session to avoid the "Cold Start" redirect loop
  const syncState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => {
      const newState = { ...prev, ...updates };
      if (newState.session) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          user: newState.user,
          profile: newState.profile,
          session: newState.session
        }));
      } else if (updates.isLoading === false && !updates.session) {
        localStorage.removeItem(CACHE_KEY);
      }
      return newState;
    });
  }, []);

  useEffect(() => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    let mounted = true;

    const fetchProfile = async (id: string): Promise<UserProfile | null> => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) return null;
        return data as UserProfile;
      } catch (e) { return null; }
    };

    const handleSession = async (session: Session | null, event?: string) => {
      if (!mounted) return;
      console.log(`[AUTH] Processing ${event || 'initial'} session...`);

      const currentToken = session?.access_token || 'none';
      if (currentToken === lastTokenRef.current && event !== 'SIGNED_OUT' && event !== 'SIGNED_IN') {
        // Redundant - unless we are just finishing initialization
        if (authState.isLoading) syncState({ isLoading: false });
        return;
      }
      lastTokenRef.current = currentToken;

      if (session) {
        // We have a session! Get profile and finish loading.
        const profile = await fetchProfile(session.user.id);
        syncState({ user: session.user, session, profile, isLoading: false });
      } else {
        // No session. Stop loading.
        syncState({ user: null, session: null, profile: null, isLoading: false });
      }
    };

    // 2. WAKE UP Supabase (Absolute priority for Google Auth redirects)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) handleSession(session, 'WAKE_UP_CALL');
    });

    // 3. Setup Listener for Real-time events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[AUTH] Auth event: ${event}`);
      if (mounted) handleSession(session, event);
    });

    // Panic Timeout: If after 5s we are still "isLoading", force it to false to unblock.
    const panicTimer = setTimeout(() => {
      if (mounted && authState.isLoading) {
        console.warn('[AUTH] Force unblocking UI (Initial sync expired)');
        syncState({ isLoading: false });
      }
    }, 5000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(panicTimer);
    };
  }, [syncState]); // authState.isLoading as dependency could cause loops if not careful

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
    localStorage.removeItem(CACHE_KEY);
    await supabase.auth.signOut();
    syncState({ user: null, session: null, profile: null, isLoading: false });
  }, [syncState]);

  const signInWithGoogle = useCallback(async () => {
    console.log('[AUTH] Starting Google OAuth...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
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
