import { useAuth } from '@/features/auth';
import { SAAS_CONFIG } from '@/config/saas';
import { PLAN_LIMITS } from '@/config/constants';

const GRID_WEIGHTS = {
  '3x3': 1,
  '5x5': 2,
  '7x7': 3,
} as const;

/**
 * Custom hook to manage SaaS-specific user status, credits, and permissions.
 * Decouples business logic from UI components.
 */
export function useSaaSStatus() {
  const { profile, user } = useAuth();
  
  const credits = profile?.credits ?? 0;
  const plan = profile?.plan ?? 'free';
  const maxGridSize = PLAN_LIMITS[plan]?.maxGridSize ?? '5x5';

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

  /**
   * Evaluates if a specific grid size is permitted under the user's active plan.
   */
  const isGridSizeAllowed = (gridSize: '3x3' | '5x5' | '7x7'): boolean => {
    return GRID_WEIGHTS[gridSize] <= GRID_WEIGHTS[maxGridSize];
  };

  return {
    credits,
    formattedCredits,
    canAfford,
    user,
    profile,
    plan,
    isGridSizeAllowed,
    config: SAAS_CONFIG
  };
}
