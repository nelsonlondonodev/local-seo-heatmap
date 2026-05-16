/**
 * Atomic component to display the current application version.
 * The version is injected automatically from package.json via Vite.
 */
interface AppVersionProps {
  isCollapsed?: boolean;
}

export function AppVersion({ isCollapsed }: AppVersionProps) {
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';

  if (isCollapsed) return null;

  return (
    <div className="px-7 py-3 mt-auto">
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 block text-center lg:text-left">
        MapRanker Pro v{version}
      </span>
    </div>
  );
}
