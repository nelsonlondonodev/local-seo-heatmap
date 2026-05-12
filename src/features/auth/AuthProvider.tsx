import { useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { AuthContext } from './hooks/useAuth';
import { profileService, type UserProfile } from '@/services/profileService';
import { AUTH_CONFIG } from './constants';
import { useSessionSync } from './hooks/useSessionSync';
import { useInactivityTimer } from './hooks/useInactivityTimer';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
}

/**
 * AUTO-HEALING AUTH PROVIDER.
 * Detects missing profiles and creates them on-the-fly to ensure stability.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
  });

  // 1. STATE REF FOR ATOMIC CHECKS (Internal consistency)
  const stateRef = useRef(authState);
  useEffect(() => {
    stateRef.current = authState;
  }, [authState]);

  // 2. AUTH ACTIONS
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
    sessionStorage.removeItem(AUTH_CONFIG.VOLATILE_SESSION_KEY);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }, []);

  // 3. CORE SESSION HANDLER
  const handleSession = useCallback(async (session: Session | null, event: string) => {
    logger.debug(`[AUTH_EVENT] ${event}`, { userId: session?.user?.id });      
    const currentUser = stateRef.current.user;
    const currentProfile = stateRef.current.profile;

    try {
      if (session) {
        if (session.user.id === currentUser?.id && currentProfile && !stateRef.current.isLoading) {
          setAuthState(prev => ({ ...prev, user: session.user!, session }));
          return;
        }

        let profile = await profileService.getProfile(session.user.id);
        
        if (!profile) {
           profile = await profileService.createInitialProfile(
             session.user.id, 
             session.user.email || '', 
             session.user.user_metadata?.full_name || 'Nuevo Usuario'
           );
        }

        setAuthState({
          user: session.user,
          session,
          profile,
          isLoading: false,
        });
      } else {
        setAuthState({ user: null, session: null, profile: null, isLoading: false });
      }
    } catch (err) {
      logger.error('[AUTH] Critical session handler failure:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // 4. SECURITY HOOKS
  useSessionSync({
    signOut,
    onRecovered: (session) => handleSession(session, 'INITIAL_WAKEUP_RECOVERED'),
    onInitialWakeup: (session) => handleSession(session, 'INITIAL_WAKEUP')
  });

  useInactivityTimer({
    hasSession: !!authState.session,
    signOut
  });

  // 5. AUTH STATE LISTENERS (Token refresh, sign-in, sign-out)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        sessionStorage.setItem(AUTH_CONFIG.VOLATILE_SESSION_KEY, 'true');
      }
      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem(AUTH_CONFIG.VOLATILE_SESSION_KEY);
      }
      handleSession(session, event);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSession]);

  // 6. SAFETY PANIC TIMER
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthState(prev => {
        if (prev.isLoading) {
          logger.warn('[AUTH_PANIC] Safety timeout triggered.');
          return { ...prev, isLoading: false };
        }
        return prev;
      });
    }, 5000); 

    return () => clearTimeout(timer);
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
