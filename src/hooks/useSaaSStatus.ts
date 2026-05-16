import { useAuth } from '@/features/auth';
import { SAAS_CONFIG } from '@/config/saas';

/**
 * Custom hook to manage SaaS-specific user status, credits, and permissions.
 * Decouples business logic from UI components.
 */
export function useSaaSStatus() {
  const { profile, user } = useAuth();
  
  const credits = profile?.credits ?? 0;
  
  /**
   * Checks if the user has enough credits for a specific cost.
   */
  const canAfford = (cost: number) => {
    return credits >= cost;
  };

  /**
   * Returns a formatted version of the credits for the UI.
   */
  const formattedCredits = new Intl.NumberFormat().format(credits);

  return {
    credits,
    formattedCredits,
    canAfford,
    user,
    profile,
    config: SAAS_CONFIG
  };
}
