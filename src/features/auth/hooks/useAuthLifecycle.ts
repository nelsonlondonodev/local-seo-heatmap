import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { profileService } from '@/services/profileService';
import { AUTH_CONFIG } from '../constants';
import type { Session } from '@supabase/supabase-js';

interface UseAuthLifecycleProps {
  stateRef: React.MutableRefObject<any>;
  setAuthState: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * Hook to manage the core authentication lifecycle, session handling, 
 * and profile synchronization.
 */
export function useAuthLifecycle({ stateRef, setAuthState }: UseAuthLifecycleProps) {
  
  const handleSession = useCallback(async (session: Session | null, event: string) => {
    logger.debug(`[AUTH_EVENT] ${event}`, { userId: session?.user?.id });      
    
    const { user: currentUser, profile: currentProfile, isLoading } = stateRef.current;

    try {
      if (session) {
        // Skip fetch if we already have consistent state
        if (session.user.id === currentUser?.id && currentProfile && !isLoading) {
          setAuthState((prev: any) => ({ ...prev, user: session.user, session }));
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
      setAuthState((prev: any) => ({ ...prev, isLoading: false }));
    }
  }, [stateRef, setAuthState]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Security: Update volatile flag on specific events
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

  return { handleSession };
}
