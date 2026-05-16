import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth, type UserRole } from '@/features/auth';
import { cn } from '@/lib/utils';

const getRoleBadgeStyle = (_role: UserRole | null) => {
  return 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 shadow-none';
};

interface UserSectionProps {
  onLogoutClick: () => void;
  isCollapsed: boolean;
}

/**
 * Atomic component to display user profile information and role in the sidebar.
 */
export function UserSection({ onLogoutClick, isCollapsed }: UserSectionProps) {
  const { user, profile, role } = useAuth();

  return (
    <div className={cn("p-4 mt-auto transition-all", isCollapsed && "px-2")}>
      <div className={cn(
        "flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800 shadow-none transition-all hover:border-zinc-300 dark:hover:border-zinc-700",
        isCollapsed && "flex-col p-2 gap-2"
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-sm font-semibold text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800">
          {user?.email?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 overflow-hidden"
          >
            <p className="truncate text-sm font-semibold tracking-tight text-zinc-950 dark:text-white">
              {profile?.full_name ?? user?.user_metadata?.full_name ?? 'Usuario'}
            </p>
            <div className="flex flex-col gap-1.5 mt-0.5">
              <p className="truncate text-[10px] font-medium text-zinc-500 dark:text-zinc-400 leading-none">
                {user?.email ?? ''}
              </p>
              {role && (
                <Badge variant="outline" className={`w-fit px-2 py-0 h-4 text-[9px] font-medium uppercase tracking-wider ${getRoleBadgeStyle(role)}`}>
                  {role.replace('-', ' ')}
                </Badge>
              )}
            </div>
          </motion.div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onLogoutClick}
          className={cn(
            "h-8 w-8 shrink-0 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
            isCollapsed && "h-7 w-7"
          )}
          title="Cerrar Sesión"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
