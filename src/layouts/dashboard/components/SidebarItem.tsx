import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  path: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

export function SidebarItem({ 
  path, 
  label, 
  icon: Icon, 
  isActive, 
  isCollapsed, 
  onClick 
}: SidebarItemProps) {
  const isAdminItem = path === '/admin';

  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
        isActive
          ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold"
          : "text-zinc-500 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-950 dark:hover:text-white",
        isCollapsed && "justify-center px-0"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
      
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="truncate"
        >
          {label}
        </motion.span>
      )}

      {/* Admin Visual Badge (Wow UX/UI Effect) */}
      {isAdminItem && !isCollapsed && (
        <span className="ml-auto rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-500 border border-red-500/20">
          Admin
        </span>
      )}

      {isActive && !isCollapsed && !isAdminItem && (
        <ChevronRight className="ml-auto h-4 w-4 text-zinc-400 dark:text-zinc-600" />
      )}
    </Link>
  );
}
