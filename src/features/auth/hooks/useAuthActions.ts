import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AUTH_CONFIG } from '../constants';

import type { AuthState } from '../types';

interface UseAuthActionsProps {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

/**
 * Hook to encapsulate authentication actions.
 */
export function useAuthActions({ setAuthState }: UseAuthActionsProps) {
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
  }, [setAuthState]);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }, []);

  return { signIn, signUp, signOut, signInWithGoogle };
}
