// Quick Stats Widget - Compact stats display for dashboards
import { motion } from 'framer-motion';
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';

interface QuickStat {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

interface QuickStatsProps {
  stats: QuickStat[];
  compact?: boolean;
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
  green: 'bg-green-50 text-green-600 dark:bg-green-900/20',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/20',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
};

export function QuickStats({ stats, compact = false }: QuickStatsProps) {
  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="p-3">
            <div className="flex items-center gap-2">
              {stat.icon && (
                <div className={`p-1.5 rounded-lg ${colorMap[stat.color || 'blue']}`}>
                  {stat.icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold">{stat.value}</span>
                  {stat.change !== undefined && (
                    <span className={`flex items-center text-xs ${
                      stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {stat.change > 0 ? <TrendUp size={12} /> : stat.change < 0 ? <TrendDown size={12} /> : <Minus size={12} />}
                      {Math.abs(stat.change)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
