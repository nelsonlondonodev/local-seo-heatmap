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
 * AUTO-HEALING AUTH PROVIDER.
 * Detects missing profiles and creates them on-the-fly to ensure stability.
 * Completely autonomous from database triggers.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
  });


  // 1. INDEPENDENT PANIC TIMER
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthState(prev => {
        if (prev.isLoading) {
          console.warn('[AUTH_PANIC] Safety timeout triggered. UI unblocked!');
          return { ...prev, isLoading: false };
        }
        return prev;
      });
    }, 4000); 

    return () => clearTimeout(timer);
  }, []);

  // 2. STATE REF FOR ATOMIC CHECKS (Internal consistency)
  const stateRef = useRef(authState);
  useEffect(() => {
    stateRef.current = authState;
  }, [authState]);

  // 3. MAIN AUTH SUBSYSTEM
  useEffect(() => {
    let mounted = true;

    const handleSession = async (session: Session | null, event: string) => {
      if (!mounted) return;
      
      const currentUser = stateRef.current.user;
      const currentProfile = stateRef.current.profile;

      try {
        if (session) {
          // If we already have this user and profile, we skip the fetch
          if (session.user.id === currentUser?.id && currentProfile && !stateRef.current.isLoading) {
            console.log(`[AUTH] Event: ${event} | Skipping redundant profile fetch (Already stabilized)`);
            setAuthState(prev => ({ ...prev, user: session.user!, session }));
            return;
          }

          console.log(`[AUTH] Event: ${event} | Session: ${!!session} | Processing...`);
          let profile = await profileService.getProfile(session.user.id);
          
          // RESCUE LOGIC: If profile doesn't exist, create it manually now
          if (!profile && mounted) {
             console.log('[AUTH] Profile missing, initiating rescue creation...');
             profile = await profileService.createInitialProfile(
               session.user.id, 
               session.user.email || '', 
               session.user.user_metadata?.full_name || 'Nuevo Usuario'
             );
          }

          if (mounted) {
            setAuthState({
              user: session.user,
              session,
              profile,
              isLoading: false,
            });
            console.log('[AUTH] Ready: Session and Profile stabilized');
          }
        } else {
          if (mounted) {
            setAuthState({ user: null, session: null, profile: null, isLoading: false });
          }
        }
      } catch (err) {
        console.error('[AUTH] Critical session handler failure:', err);
        if (mounted) setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    // A. Initial Wakeup
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session, 'INITIAL_WAKEUP');
    });

    // B. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleSession(session, event);
    });

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
