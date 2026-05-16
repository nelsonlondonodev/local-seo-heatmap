/**
 * Atomic component to display the current application version.
 * The version is injected automatically from package.json via Vite.
 */
import { SAAS_CONFIG } from '@/config/saas';

interface AppVersionProps {
  isCollapsed?: boolean;
}

export function AppVersion({ isCollapsed }: AppVersionProps) {
  const { BRAND } = SAAS_CONFIG;

  if (isCollapsed) return null;

  return (
    <div className="px-7 py-3 mt-auto">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 block text-center lg:text-left">
        {BRAND.NAME} v{BRAND.VERSION}
      </span>
    </div>
  );
}
