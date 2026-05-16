import { useEffect, useState, useMemo, useRef, useCallback, type ReactNode } from 'react';

import { AuthContext } from './hooks/useAuth';
import { useSessionSync } from './hooks/useSessionSync';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import { useAuthActions } from './hooks/useAuthActions';
import { useAuthLifecycle } from './hooks/useAuthLifecycle';
import type { AuthState } from './types';

/**
 * PREMIUM AUTH PROVIDER
 * Orchestrates authentication state, security policies, and user profiles.
 * Atomized into specialized hooks for maximum maintainability.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
  });

  // 1. PERSISTENT STATE REFERENCE
  const stateRef = useRef(authState);
  useEffect(() => {
    stateRef.current = authState;
  }, [authState]);

  // 2. AUTHENTICATION ACTIONS (signIn, signUp, signOut, Google)
  const { signIn, signUp, signOut, signInWithGoogle } = useAuthActions({ setAuthState });

  // 3. LIFECYCLE & PROFILE SYNC
  const { handleSession } = useAuthLifecycle({ stateRef, setAuthState });

  // 4. SECURITY & SESSION POLICIES
  const onRecovered = useCallback((session: any) => handleSession(session, 'INITIAL_WAKEUP_RECOVERED'), [handleSession]);
  const onInitialWakeup = useCallback((session: any) => handleSession(session, 'INITIAL_WAKEUP'), [handleSession]);

  useSessionSync({ signOut, onRecovered, onInitialWakeup });
  
  useInactivityTimer({ hasSession: !!authState.session, signOut });

  // 5. SAFETY TIMEOUT (Unblocks UI in case of auth failure)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthState(prev => prev.isLoading ? { ...prev, isLoading: false } : prev);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // 6. CONTEXT VALUE MEMOIZATION
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
