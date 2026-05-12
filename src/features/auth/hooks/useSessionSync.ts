import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { AUTH_CONFIG } from '../constants';

interface UseSessionSyncProps {
  signOut: () => Promise<void>;
  onRecovered: (session: any) => void;
  onInitialWakeup: (session: any) => void;
}

/**
 * Hook to handle volatile session persistence and cross-tab synchronization.
 * Ensures the session is cleared when the browser is closed (via sessionStorage)
 * but preserved when new tabs are opened (via BroadcastChannel).
 */
export function useSessionSync({ signOut, onRecovered, onInitialWakeup }: UseSessionSyncProps) {
  useEffect(() => {
    let mounted = true;

    // 1. Initial Wakeup with Volatile Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      const hasVolatileFlag = sessionStorage.getItem(AUTH_CONFIG.VOLATILE_SESSION_KEY);
      
      if (session && !hasVolatileFlag) {
        // Potential new browser session. Ask other tabs for confirmation.
        const channel = new BroadcastChannel(AUTH_CONFIG.SYNC_CHANNEL_NAME);
        let responded = false;

        channel.onmessage = (msg) => {
          if (msg.data === 'SESSION_ALIVE') {
            responded = true;
            sessionStorage.setItem(AUTH_CONFIG.VOLATILE_SESSION_KEY, 'true');
            onRecovered(session);
          }
        };

        channel.postMessage('IS_SESSION_ALIVE');

        // Wait for potential responses from other tabs
        setTimeout(() => {
          if (!responded && mounted) {
            logger.warn('[AUTH_SECURITY] No active sessions found in other tabs. Forcing logout.');
            signOut();
          }
          channel.close();
        }, AUTH_CONFIG.SYNC_RESPONSE_TIMEOUT);
      } else {
        if (session) {
          sessionStorage.setItem(AUTH_CONFIG.VOLATILE_SESSION_KEY, 'true');
        }
        onInitialWakeup(session);
      }
    });

    // 2. Tab Synchronization Listener
    // Answers "IS_SESSION_ALIVE" queries from other tabs
    const syncChannel = new BroadcastChannel(AUTH_CONFIG.SYNC_CHANNEL_NAME);
    syncChannel.onmessage = (msg) => {
      if (msg.data === 'IS_SESSION_ALIVE' && sessionStorage.getItem(AUTH_CONFIG.VOLATILE_SESSION_KEY)) {
        syncChannel.postMessage('SESSION_ALIVE');
      }
    };

    return () => {
      mounted = false;
      syncChannel.close();
    };
  }, [signOut, onRecovered, onInitialWakeup]);
}
