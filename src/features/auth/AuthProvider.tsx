import { useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { AuthContext } from './hooks/useAuth';
import { profileService, type UserProfile } from '@/services/profileService';

const VOLATILE_SESSION_KEY = 'seo_heatmap_session_active';
const AUTH_CHANNEL_NAME = 'auth_sync_channel';
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 horas

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

  const [lastActivity, setLastActivity] = useState(Date.now());


  // 1. INDEPENDENT PANIC TIMER
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthState(prev => {
        if (prev.isLoading) {
          logger.warn('[AUTH_PANIC] Safety timeout triggered. UI unblocked!');
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
    sessionStorage.removeItem(VOLATILE_SESSION_KEY);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }, []);

  // 3. MAIN AUTH SUBSYSTEM
  useEffect(() => {
    let mounted = true;

    const handleSession = async (session: Session | null, event: string) => {
      if (!mounted) return;
      logger.debug(`[AUTH_EVENT] ${event}`, { userId: session?.user?.id });      
      const currentUser = stateRef.current.user;
      const currentProfile = stateRef.current.profile;

      try {
        if (session) {
          // If we already have this user and profile, we skip the fetch
          if (session.user.id === currentUser?.id && currentProfile && !stateRef.current.isLoading) {
            setAuthState(prev => ({ ...prev, user: session.user!, session }));
            return;
          }

          let profile = await profileService.getProfile(session.user.id);
          
          // RESCUE LOGIC: If profile doesn't exist, create it manually now
          if (!profile && mounted) {
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
          }
        } else {
          if (mounted) {
            setAuthState({ user: null, session: null, profile: null, isLoading: false });
          }
        }
      } catch (err) {
        logger.error('[AUTH] Critical session handler failure:', err);
        if (mounted) setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    // A. Initial Wakeup with Volatile Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const hasVolatileFlag = sessionStorage.getItem(VOLATILE_SESSION_KEY);
      
      if (session && !hasVolatileFlag) {
        // We have a session in localStorage but NO flag in sessionStorage.
        // This could be a new browser window. Let's ask other tabs before killing it.
        const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
        let responded = false;

        channel.onmessage = (msg) => {
          if (msg.data === 'SESSION_ALIVE') {
            responded = true;
            sessionStorage.setItem(VOLATILE_SESSION_KEY, 'true');
            handleSession(session, 'INITIAL_WAKEUP_RECOVERED');
          }
        };

        // Ask if anyone is alive
        channel.postMessage('IS_SESSION_ALIVE');

        // Wait a bit for a response
        setTimeout(() => {
          if (!responded && mounted) {
            logger.warn('[AUTH_SECURITY] No active tabs found. Force logout for security.');
            signOut();
          }
          channel.close();
        }, 150);
      } else {
        if (session) sessionStorage.setItem(VOLATILE_SESSION_KEY, 'true');
        handleSession(session, 'INITIAL_WAKEUP');
      }
    });

    // B. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        sessionStorage.setItem(VOLATILE_SESSION_KEY, 'true');
      }
      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem(VOLATILE_SESSION_KEY);
      }
      handleSession(session, event);
    });

    // C. Tab Synchronization Listener
    const syncChannel = new BroadcastChannel(AUTH_CHANNEL_NAME);
    syncChannel.onmessage = (msg) => {
      if (msg.data === 'IS_SESSION_ALIVE' && sessionStorage.getItem(VOLATILE_SESSION_KEY)) {
        syncChannel.postMessage('SESSION_ALIVE');
      }
    };

    return () => {
      mounted = false;
      subscription.unsubscribe();
      syncChannel.close();
    };
  }, [signOut]);

  // 4. INACTIVITY MONITOR
  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    const interval = setInterval(() => {
      const now = Date.now();
      if (authState.session && (now - lastActivity > INACTIVITY_TIMEOUT)) {
        logger.warn('[AUTH_SECURITY] Inactivity timeout reached.');
        signOut();
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [authState.session, lastActivity, signOut]);

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
