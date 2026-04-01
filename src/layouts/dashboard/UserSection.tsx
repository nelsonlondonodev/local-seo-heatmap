import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth, type UserRole } from '@/features/auth';

const getRoleBadgeStyle = (role: UserRole | null) => {
  switch (role) {
    case 'super-admin':
      return 'bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm shadow-amber-200';
    case 'owner':
      return 'bg-blue-600 hover:bg-blue-700 text-white border-none';
    case 'admin':
      return 'bg-indigo-500 hover:bg-indigo-600 text-white border-none';
    case 'staff':
      return 'bg-emerald-500 hover:bg-emerald-600 text-white border-none';
    default:
      return 'bg-slate-500 hover:bg-slate-600 text-white border-none';
  }
};

interface UserSectionProps {
  onLogoutClick: () => void;
}

/**
 * Atomic component to display user profile information and role in the sidebar.
 */
export function UserSection({ onLogoutClick }: UserSectionProps) {
  const { user, profile, role } = useAuth();

  return (
    <div className="p-4 mt-auto">
      <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-4 border border-border/50 shadow-sm transition-all hover:bg-muted/60">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-background shadow-inner">
          {user?.email?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-bold tracking-tight text-foreground">
            {profile?.full_name ?? user?.user_metadata?.full_name ?? 'Usuario'}
          </p>
          <div className="flex flex-col gap-1.5">
            <p className="truncate text-[10px] font-medium text-muted-foreground/80 leading-none">
              {user?.email ?? ''}
            </p>
            {role && (
              <Badge className={`w-fit px-2 py-0 h-4 text-[9px] font-black uppercase tracking-wider ${getRoleBadgeStyle(role)} transition-all duration-300`}>
                {role.replace('-', ' ')}
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogoutClick}
          className="h-9 w-9 shrink-0 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
          title="Cerrar Sesión"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
