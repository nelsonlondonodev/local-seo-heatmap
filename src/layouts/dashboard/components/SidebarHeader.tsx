import { X, PanelLeftClose } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function SidebarHeader({ isCollapsed, isMobile, onToggle, onClose }: SidebarHeaderProps) {
  return (
    <div className={cn("flex h-16 items-center px-6", isCollapsed && "px-0 justify-center")}>
      {!isCollapsed ? (
        <Logo textClassName="text-lg font-bold dark:text-white text-zinc-950" />
      ) : (
        <div className="h-8 w-8 rounded-lg bg-zinc-950 dark:bg-white flex items-center justify-center">
          <div className="h-4 w-4 rounded-sm border-2 border-white dark:border-zinc-950" />
        </div>
      )}
      
      {!isCollapsed && !isMobile && (
        <button
          className="ml-auto hidden lg:flex p-1.5 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          onClick={onToggle}
          aria-label="Colapsar menú"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      )}
      
      <button
        className="ml-auto lg:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        onClick={onClose}
        aria-label="Cerrar menú"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
