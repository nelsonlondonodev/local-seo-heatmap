/**
 * Authentication and Security Constants
 */

export const AUTH_CONFIG = {
  // Key for volatile session flag in sessionStorage
  VOLATILE_SESSION_KEY: 'seo_heatmap_session_active',
  
  // Name for the cross-tab communication channel
  SYNC_CHANNEL_NAME: 'auth_sync_channel',
  
  // Inactivity timeout in milliseconds (2 hours)
  INACTIVITY_TIMEOUT: 2 * 60 * 60 * 1000,
  
  // Frequency to check for inactivity (1 minute)
  INACTIVITY_CHECK_INTERVAL: 60 * 1000,
  
  // Delay to wait for other tabs to respond during initial wakeup (ms)
  SYNC_RESPONSE_TIMEOUT: 150,
};
