/**
 * MapRanker Pro — SaaS Business Configuration
 * Centralized source of truth for costs, SEO, and business rules.
 */

export const SAAS_CONFIG = {
  // 💰 Credit Costs
  COSTS: {
    SCAN: 1,           // Points per search point
    AI_AUDIT: 2,       // Extra points for OpenAI analysis
  },

  // 🛡️ Security & Access
  SECURITY: {
    MIN_SECONDS_BETWEEN_SCANS: 20,
    DEFAULT_INITIAL_CREDITS: 100,
  },

  // 📈 SEO & Visibility
  SEO: {
    BASE_URL: 'https://mapranker.pro',
    PROTECTED_PATHS: [
      '/dashboard',
      '/admin',
      '/settings',
      '/history',
      '/ai-history',
      '/market-discovery',
      '/site-analyzer',
      '/rank-tracker',
      '/result',
      '/auth'
    ],
  },
  
  // 🏷️ Brand
  BRAND: {
    NAME: 'MapRanker Pro',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  }
} as const;
