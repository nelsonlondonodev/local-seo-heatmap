import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp } from '@/config/animations';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  index: number;
}

export function StatCard({ label, value, icon: Icon, index }: StatCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group cursor-default rounded-xl overflow-hidden">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
            <div className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">{value}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
