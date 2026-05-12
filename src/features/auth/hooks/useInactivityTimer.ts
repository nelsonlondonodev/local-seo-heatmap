import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import { AUTH_CONFIG } from '../constants';

interface UseInactivityTimerProps {
  hasSession: boolean;
  signOut: () => Promise<void>;
}

/**
 * Hook to monitor user activity and automatically sign out after a period of inactivity.
 * Uses a Ref for lastActivity to avoid unnecessary re-renders and effect churn.
 */
export function useInactivityTimer({ hasSession, signOut }: UseInactivityTimerProps) {
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!hasSession) return;

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };
    
    // Listen for common interaction events
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    // Periodically check for inactivity
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;

      if (elapsed > AUTH_CONFIG.INACTIVITY_TIMEOUT) {
        logger.warn('[AUTH_SECURITY] Session expired due to inactivity.');
        signOut();
      }
    }, AUTH_CONFIG.INACTIVITY_CHECK_INTERVAL);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [hasSession, signOut]); // lastActivityRef removed from dependencies
}
